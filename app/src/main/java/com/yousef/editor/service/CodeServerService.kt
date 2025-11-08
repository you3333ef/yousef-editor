package com.yousef.editor.service

import android.app.*
import android.content.Context
import android.content.Intent
import android.os.Binder
import android.os.Build
import android.os.IBinder
import android.os.PowerManager
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.yousef.editor.MainActivity
import com.yousef.editor.R
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL

/**
 * CodeServerService - Background service inspired by VHEditor-Android
 *
 * Features:
 * - Keeps app alive with foreground service
 * - Monitors code-server connection
 * - Shows persistent notification
 * - Manages wake locks
 * - Provides connection status
 */
class CodeServerService : Service() {

    companion object {
        const val TAG = "CodeServerService"
        const val CHANNEL_ID = "yousef_editor_service"
        const val NOTIFICATION_ID = 1
        const val ACTION_START = "start"
        const val ACTION_STOP = "stop"
        const val ACTION_CHECK = "check"

        private var instance: CodeServerService? = null
        fun getInstance(): CodeServerService? = instance
    }

    private var wakeLock: PowerManager.WakeLock? = null
    private var serviceThread: Thread? = null
    private var isRunning = false
    private var isConnected = false
    private val binder = LocalBinder()

    private var connectionCheckUrl = "http://localhost:8080"
    private var lastCheckTime = 0L
    private var checkInterval = 5000L // Check every 5 seconds

    inner class LocalBinder : Binder() {
        fun getService(): CodeServerService = this@CodeServerService
    }

    override fun onCreate() {
        super.onCreate()
        instance = this
        createNotificationChannel()
        acquireWakeLock()
        Log.d(TAG, "Service created")
    }

    override fun onBind(intent: Intent?): IBinder = binder

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        intent?.action?.let { action ->
            Log.d(TAG, "Received action: $action")
            when (action) {
                ACTION_START -> startService()
                ACTION_STOP -> stopService()
                ACTION_CHECK -> performConnectionCheck()
            }
        }
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        isRunning = false
        serviceThread?.interrupt()
        releaseWakeLock()
        instance = null
        Log.d(TAG, "Service destroyed")
    }

    /**
     * Create notification channel for Android O and above
     */
    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Yousef Editor Service",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Service for keeping Yousef Editor running"
                setShowBadge(false)
                enableLights(false)
                enableVibration(false)
            }
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
    }

    /**
     * Acquire wake lock to keep CPU running
     */
    private fun acquireWakeLock() {
        val powerManager = getSystemService(Context.POWER_SERVICE) as PowerManager
        wakeLock = powerManager.newWakeLock(
            PowerManager.PARTIAL_WAKE_LOCK,
            "YousefEditor::ServiceWakeLock"
        )
        wakeLock?.acquire(10 * 60 * 1000L) // 10 minutes max
        Log.d(TAG, "Wake lock acquired")
    }

    /**
     * Release wake lock
     */
    private fun releaseWakeLock() {
        wakeLock?.let {
            if (it.isHeld) {
                it.release()
                Log.d(TAG, "Wake lock released")
            }
        }
    }

    /**
     * Start the service
     */
    private fun startService() {
        if (isRunning) return

        isRunning = true
        startForeground(NOTIFICATION_ID, createNotification())
        startConnectionMonitor()
        Log.d(TAG, "Service started")
    }

    /**
     * Stop the service
     */
    private fun stopService() {
        isRunning = false
        serviceThread?.interrupt()
        stopForeground(true)
        stopSelf()
        Log.d(TAG, "Service stopped")
    }

    /**
     * Start connection monitoring thread
     */
    private fun startConnectionMonitor() {
        serviceThread = Thread {
            while (isRunning) {
                performConnectionCheck()
                try {
                    Thread.sleep(checkInterval)
                } catch (e: InterruptedException) {
                    break
                }
            }
        }
        serviceThread?.start()
    }

    /**
     * Perform connection check to code-server
     */
    fun performConnectionCheck(url: String = connectionCheckUrl): Boolean {
        return try {
            lastCheckTime = System.currentTimeMillis()
            val connectionUrl = URL(url)
            val conn = connectionUrl.openConnection() as HttpURLConnection
            conn.connectTimeout = 3000
            conn.readTimeout = 3000
            val responseCode = conn.responseCode
            conn.disconnect()

            val wasConnected = isConnected
            isConnected = (responseCode == 200)

            // Update notification if status changed
            if (wasConnected != isConnected) {
                updateNotification()
            }

            Log.d(TAG, "Connection check: $url - ${if (isConnected) "Connected" else "Disconnected"}")
            isConnected
        } catch (e: Exception) {
            val wasConnected = isConnected
            isConnected = false
            if (wasConnected != isConnected) {
                updateNotification()
            }
            Log.d(TAG, "Connection check failed: ${e.message}")
            false
        }
    }

    /**
     * Create notification
     */
    private fun createNotification(): Notification {
        val status = if (isConnected) "Connected" else "Disconnected"
        val contentText = if (isConnected) {
            "Code-server is running"
        } else {
            "Code-server not found"
        }

        // Create stop action
        val stopIntent = Intent(this, CodeServerService::class.java).apply {
            action = ACTION_STOP
        }
        val stopPendingIntent = PendingIntent.getService(
            this, 0, stopIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // Create check action
        val checkIntent = Intent(this, CodeServerService::class.java).apply {
            action = ACTION_CHECK
        }
        val checkPendingIntent = PendingIntent.getService(
            this, 0, checkIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // Create open app action
        val openIntent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        val openPendingIntent = PendingIntent.getActivity(
            this, 0, openIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle("Yousef Editor")
            .setContentText(contentText)
            .setSubText(status)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setOngoing(true)
            .setContentIntent(openPendingIntent)
            .addAction(R.drawable.ic_check, "Check", checkPendingIntent)
            .addAction(R.drawable.ic_close, "Stop", stopPendingIntent)
            .setColor(getColor(R.color.primary_color))
            .build()
    }

    /**
     * Update notification
     */
    private fun updateNotification() {
        val notification = createNotification()
        val manager = NotificationManagerCompat.from(this)
        manager.notify(NOTIFICATION_ID, notification)
    }

    /**
     * Get connection status
     */
    fun isConnected(): Boolean = isConnected

    /**
     * Get last check time
     */
    fun getLastCheckTime(): Long = lastCheckTime

    /**
     * Set connection check URL
     */
    fun setConnectionCheckUrl(url: String) {
        connectionCheckUrl = url
    }

    /**
     * Get connection check URL
     */
    fun getConnectionCheckUrl(): String = connectionCheckUrl
}
