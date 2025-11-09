package com.yousef.editor.termux

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.util.Log
import java.io.BufferedReader
import java.io.InputStreamReader

/**
 * TermuxManager - Automatic Termux integration
 *
 * Features:
 * - Detect if Termux is installed
 * - Check if code-server is installed
 * - Auto-install code-server via Termux
 * - Start code-server automatically
 * - Manage Termux sessions
 */
class TermuxManager(private val context: Context) {

    companion object {
        const val TAG = "TermuxManager"
        const val TERMUX_PACKAGE = "com.termux"
        const val TERMUX_API_PACKAGE = "com.termux.api"
        const val CODE_SERVER_PORT = 8080
    }

    private val isTermuxInstalled: Boolean
        get() = isPackageInstalled(TERMUX_PACKAGE)

    private val isTermuxApiInstalled: Boolean
        get() = isPackageInstalled(TERMUX_API_PACKAGE)

    /**
     * Check if Termux is installed
     */
    fun isTermuxAvailable(): Boolean = isTermuxInstalled

    /**
     * Check if code-server is installed in Termux
     */
    fun isCodeServerInstalled(): Boolean {
        if (!isTermuxInstalled) return false

        return try {
            val command = "which code-server"
            val result = executeTermuxCommand(command)
            result.isNotEmpty() && result.contains("code-server")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to check code-server", e)
            false
        }
    }

    /**
     * Install code-server via Termux
     */
    fun installCodeServer(): Boolean {
        if (!isTermuxInstalled) {
            Log.e(TAG, "Termux is not installed")
            return false
        }

        return try {
            Log.d(TAG, "Installing code-server via Termux")

            // Create script to install code-server
            val installScript = """
                #!/data/data/com.termux/files/usr/bin/bash
                pkg update -y
                pkg install nodejs -y
                npm install -g code-server
                echo "INSTALL_COMPLETE"
            """.trimIndent()

            // Use Termux API to execute the installation
            val intent = Intent("com.termux.api.execute")
            intent.setClassName(TERMUX_API_PACKAGE, "com.termux.app.TermuxApiActivity")
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

            // Create the command
            val command = "pkg update -y && pkg install nodejs -y && npm install -g code-server"

            intent.putExtra("com.termux.api.execute.command", arrayOf("sh", "-c", command))
            intent.putExtra("com.termux.api.execute.background", true)
            intent.putExtra("com.termux.api.execute.session_action", "com.termux.api.execute.action.START")

            context.startActivity(intent)

            Log.d(TAG, "Started code-server installation")
            true
        } catch (e: Exception) {
            Log.e(TAG, "Failed to install code-server", e)
            false
        }
    }

    /**
     * Start code-server in Termux
     */
    fun startCodeServer(): Boolean {
        if (!isTermuxInstalled) {
            Log.e(TAG, "Termux is not installed")
            return false
        }

        if (!isCodeServerInstalled()) {
            Log.e(TAG, "code-server is not installed")
            return false
        }

        return try {
            Log.d(TAG, "Starting code-server on port $CODE_SERVER_PORT")

            val command = "code-server --bind-addr 0.0.0.0:$CODE_SERVER_PORT --auth=none"

            // Use Termux API to start code-server in background
            val intent = Intent("com.termux.api.execute")
            intent.setClassName(TERMUX_API_PACKAGE, "com.termux.app.TermuxApiActivity")
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

            intent.putExtra("com.termux.api.execute.command", arrayOf("sh", "-c", command))
            intent.putExtra("com.termux.api.execute.background", true)
            intent.putExtra("com.termux.api.execute.session_action", "com.termux.api.execute.action.START")

            context.startActivity(intent)

            Log.d(TAG, "Started code-server via Termux")
            true
        } catch (e: Exception) {
            Log.e(TAG, "Failed to start code-server", e)
            false
        }
    }

    /**
     * Stop code-server
     */
    fun stopCodeServer(): Boolean {
        if (!isTermuxInstalled) return false

        return try {
            val command = "pkill -f code-server"

            val intent = Intent("com.termux.api.execute")
            intent.setClassName(TERMUX_API_PACKAGE, "com.termux.app.TermuxApiActivity")
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

            intent.putExtra("com.termux.api.execute.command", arrayOf("sh", "-c", command))
            intent.putExtra("com.termux.api.execute.background", true)

            context.startActivity(intent)

            Log.d(TAG, "Stopped code-server")
            true
        } catch (e: Exception) {
            Log.e(TAG, "Failed to stop code-server", e)
            false
        }
    }

    /**
     * Check if code-server is running
     */
    fun isCodeServerRunning(): Boolean {
        if (!isTermuxInstalled) return false

        return try {
            val command = "pgrep -f code-server"
            val result = executeTermuxCommand(command)
            result.isNotEmpty()
        } catch (e: Exception) {
            Log.e(TAG, "Failed to check if code-server is running", e)
            false
        }
    }

    /**
     * Get code-server URL
     */
    fun getCodeServerUrl(): String {
        return if (isCodeServerRunning()) {
            "http://localhost:$CODE_SERVER_PORT"
        } else {
            ""
        }
    }

    /**
     * Open Termux app
     */
    fun openTermux() {
        if (!isTermuxInstalled) return

        val intent = context.packageManager.getLaunchIntentForPackage(TERMUX_PACKAGE)
        intent?.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(intent)
    }

    /**
     * Open Termux API settings
     */
    fun openTermuxApiSettings() {
        if (!isTermuxApiInstalled) return

        val intent = context.packageManager.getLaunchIntentForPackage(TERMUX_API_PACKAGE)
        intent?.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(intent)
    }

    /**
     * Get Termux installation status
     */
    fun getInstallationStatus(): TermuxStatus {
        return when {
            !isTermuxInstalled -> TermuxStatus.TERMUX_NOT_INSTALLED
            !isTermuxApiInstalled -> TermuxStatus.TERMUX_API_NOT_INSTALLED
            !isCodeServerInstalled() -> TermuxStatus.CODE_SERVER_NOT_INSTALLED
            !isCodeServerRunning() -> TermuxStatus.CODE_SERVER_STOPPED
            else -> TermuxStatus.CODE_SERVER_RUNNING
        }
    }

    /**
     * Get detailed status information
     */
    fun getStatusInfo(): TermuxInfo {
        return TermuxInfo(
            isTermuxInstalled = isTermuxInstalled,
            isTermuxApiInstalled = isTermuxApiInstalled,
            isCodeServerInstalled = isCodeServerInstalled(),
            isCodeServerRunning = isCodeServerRunning(),
            codeServerUrl = getCodeServerUrl(),
            status = getInstallationStatus()
        )
    }

    /**
     * Auto-setup: Install and start code-server
     */
    fun autoSetup(): Boolean {
        if (!isTermuxInstalled) {
            Log.e(TAG, "Cannot auto-setup: Termux not installed")
            return false
        }

        if (!isCodeServerInstalled()) {
            Log.d(TAG, "Installing code-server...")
            val installResult = installCodeServer()
            if (!installResult) {
                Log.e(TAG, "Failed to install code-server")
                return false
            }
            // Note: Installation happens asynchronously
            // User may need to wait before code-server is available
        }

        if (!isCodeServerRunning()) {
            Log.d(TAG, "Starting code-server...")
            val startResult = startCodeServer()
            if (!startResult) {
                Log.e(TAG, "Failed to start code-server")
                return false
            }
        }

        return true
    }

    /**
     * Check if package is installed
     */
    private fun isPackageInstalled(packageName: String): Boolean {
        return try {
            context.packageManager.getPackageInfo(packageName, 0)
            true
        } catch (e: PackageManager.NameNotFoundException) {
            false
        } catch (e: Exception) {
            Log.e(TAG, "Error checking package: $packageName", e)
            false
        }
    }

    /**
     * Execute command in Termux (placeholder - requires root or special permissions)
     */
    private fun executeTermuxCommand(command: String): String {
        // Note: Direct command execution requires Termux API or special setup
        // This is a placeholder for future implementation
        return ""
    }
}

/**
 * Termux installation status
 */
enum class TermuxStatus {
    TERMUX_NOT_INSTALLED,
    TERMUX_API_NOT_INSTALLED,
    CODE_SERVER_NOT_INSTALLED,
    CODE_SERVER_STOPPED,
    CODE_SERVER_RUNNING
}

/**
 * Termux detailed information
 */
data class TermuxInfo(
    val isTermuxInstalled: Boolean,
    val isTermuxApiInstalled: Boolean,
    val isCodeServerInstalled: Boolean,
    val isCodeServerRunning: Boolean,
    val codeServerUrl: String,
    val status: TermuxStatus
)
