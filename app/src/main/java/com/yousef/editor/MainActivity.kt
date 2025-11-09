package com.yousef.editor

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.net.Uri
import android.os.Bundle
import android.os.IBinder
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.view.accessibility.AccessibilityEvent
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.yousef.editor.prefs.SettingsManager
import com.yousef.editor.service.CodeServerService
import com.yousef.editor.service.CodeServerService.Companion.ACTION_CHECK
import com.yousef.editor.service.CodeServerService.Companion.ACTION_START
import com.yousef.editor.service.CodeServerService.Companion.ACTION_STOP
import com.yousef.editor.tabs.TabManager
import com.yousef.editor.tabs.TabManager.Tab
import com.yousef.editor.tabs.TabManager.TabChangeListener
import com.yousef.editor.termux.TermuxManager
import com.yousef.editor.termux.TermuxStatus
import java.net.HttpURLConnection
import java.net.URL

class MainActivity : AppCompatActivity(), TabManager.TabChangeListener, ServiceConnection {

    // Core components
    private lateinit var webView: WebView
    private lateinit var errorView: View
    private lateinit var loadingView: View
    private lateinit var progressBar: ProgressBar
    private lateinit var loadingText: TextView

    // Buttons
    private lateinit var retryButton: Button
    private lateinit var setupButton: Button
    private lateinit var externalButton: Button

    // Text views
    private lateinit var errorText: TextView

    // New VHEditor-inspired features
    private lateinit var settingsManager: SettingsManager
    private lateinit var tabManager: TabManager
    private lateinit var termuxManager: TermuxManager

    // Service
    private var codeServerService: CodeServerService? = null
    private var serviceBound = false

    // UI components for new features
    private lateinit var connectionStatusView: View
    private lateinit var tabContainer: View
    private lateinit var noTabsView: View
    private lateinit var termuxStatusView: View
    private lateinit var termuxStatusText: TextView

    // Tab management
    private var isServiceEnabled = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        initializeComponents()
        setupUI()
        setupWebView()
        setupService()
        loadInitialTab()
    }

    /**
     * Initialize all components
     */
    private fun initializeComponents() {
        settingsManager = SettingsManager(this)
        tabManager = TabManager(this)
        tabManager.addListener(this)
        termuxManager = TermuxManager(this)
    }

    /**
     * Setup UI components
     */
    private fun setupUI() {
        // Find views
        webView = findViewById(R.id.webview)
        errorView = findViewById(R.id.error_view)
        loadingView = findViewById(R.id.loading_view)
        progressBar = findViewById(R.id.progress_bar)
        loadingText = findViewById(R.id.loading_text)
        retryButton = findViewById(R.id.retry_button)
        setupButton = findViewById(R.id.setup_button)
        externalButton = findViewById(R.id.external_button)
        errorText = findViewById(R.id.error_text)
        connectionStatusView = findViewById(R.id.connection_status)
        tabContainer = findViewById(R.id.tab_container)
        noTabsView = findViewById(R.id.no_tabs_view)
        termuxStatusView = findViewById(R.id.termux_status)
        termuxStatusText = findViewById(R.id.termux_status_text)

        // Setup action bar
        supportActionBar?.title = getString(R.string.app_name)
        supportActionBar?.setDisplayHomeAsUpEnabled(false)

        // Setup retry button
        retryButton.setOnClickListener {
            loadCodeServer()
        }

        // Setup install Termux button
        setupButton.setOnClickListener {
            installTermux()
        }

        // Setup external URL button
        externalButton.setOnClickListener {
            showExternalUrlDialog()
        }
    }

    /**
     * Setup WebView with secure configuration
     */
    private fun setupWebView() {
        // SECURE WebView Configuration (from VHEditor analysis)
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.settings.allowFileAccess = true
        webView.settings.allowContentAccess = true
        webView.settings.allowFileAccessFromFileURLs = false // SECURITY FIX
        webView.settings.allowUniversalAccessFromFileURLs = false // SECURITY FIX
        webView.settings.setSupportZoom(true)
        webView.settings.builtInZoomControls = true
        webView.settings.displayZoomControls = false
        webView.settings.loadWithOverviewMode = true
        webView.settings.useWideViewPort = true
        webView.settings.databaseEnabled = true
        webView.settings.setGeolocationEnabled(false)

        // Accessibility
        webView.contentDescription = getString(R.string.webview_content_description)

        // WebViewClient
        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                hideLoading()
                errorView.visibility = View.GONE
                webView.visibility = View.VISIBLE

                // Update tab connection status
                val currentTab = tabManager.getCurrentTab()
                currentTab?.let {
                    tabManager.updateTabConnection(it.id, true)
                }
            }

            override fun onReceivedError(
                view: WebView?,
                errorCode: Int,
                description: String?,
                failingUrl: String?
            ) {
                super.onReceivedError(view, errorCode, description, failingUrl)
                hideLoading()
                showError(getString(R.string.cannot_connect) + ": " + getString(R.string.make_sure_running))

                // Update tab connection status
                val currentTab = tabManager.getCurrentTab()
                currentTab?.let {
                    tabManager.updateTabConnection(it.id, false)
                }
            }
        }
    }

    /**
     * Setup service connection
     */
    private fun setupService() {
        isServiceEnabled = settingsManager.areNotificationsEnabled()

        if (isServiceEnabled) {
            val intent = Intent(this, CodeServerService::class.java).apply {
                action = ACTION_START
            }
            startForegroundService(intent)
            bindService(intent, this, Context.BIND_AUTO_CREATE)
        }
    }

    /**
     * Load initial tab
     */
    private fun loadInitialTab() {
        // Check Termux status and offer auto-setup
        checkTermuxStatusAndOfferSetup()

        val savedTab = tabManager.getCurrentTab()
        if (savedTab != null) {
            // Load saved tab
            loadUrl(savedTab.url)
        } else {
            // Create new tab
            val url = settingsManager.getCodeServerUrl()
            val tab = tabManager.addTab(url, getString(R.string.tab_local_server))
            loadUrl(tab.url)
        }
    }

    /**
     * Check Termux status and offer auto-setup if needed
     */
    private fun checkTermuxStatusAndOfferSetup() {
        val statusInfo = termuxManager.getStatusInfo()

        when (statusInfo.status) {
            TermuxStatus.TERMUX_NOT_INSTALLED -> {
                showTermuxNotInstalledDialog()
            }
            TermuxStatus.CODE_SERVER_NOT_INSTALLED -> {
                showCodeServerNotInstalledDialog()
            }
            TermuxStatus.CODE_SERVER_STOPPED -> {
                showCodeServerStoppedDialog()
            }
            else -> {
                // Everything is fine
                updateTermuxStatusUI(statusInfo)
            }
        }
    }

    /**
     * Show Termux not installed dialog
     */
    private fun showTermuxNotInstalledDialog() {
        AlertDialog.Builder(this)
            .setTitle("Install Termux")
            .setMessage("Termux is required to run code-server. Would you like to open F-Droid to install Termux?")
            .setPositiveButton("Install Termux") { _, _ ->
                val intent = android.content.Intent(android.content.Intent.ACTION_VIEW).apply {
                    data = android.net.Uri.parse("https://f-droid.org/packages/com.termux/")
                }
                startActivity(intent)
                finish()
            }
            .setNegativeButton("Exit", { _, _ ->
                finish()
            })
            .setCancelable(false)
            .show()
    }

    /**
     * Show code-server not installed dialog
     */
    private fun showCodeServerNotInstalledDialog() {
        AlertDialog.Builder(this)
            .setTitle("Install code-server")
            .setMessage("code-server is not installed in Termux. Would you like to install it now? This may take a few minutes.")
            .setPositiveButton("Install") { _, _ ->
                installCodeServer()
            }
            .setNegativeButton("Later", null)
            .show()
    }

    /**
     * Show code-server stopped dialog
     */
    private fun showCodeServerStoppedDialog() {
        AlertDialog.Builder(this)
            .setTitle("Start code-server")
            .setMessage("code-server is installed but not running. Would you like to start it?")
            .setPositiveButton("Start") { _, _ ->
                startCodeServer()
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    /**
     * Install code-server via Termux
     */
    private fun installCodeServer() {
        Toast.makeText(this, "Installing code-server. Please wait...", Toast.LENGTH_LONG).show()
        val result = termuxManager.installCodeServer()
        if (result) {
            Toast.makeText(this, "Installation started. Please wait 5-10 minutes.", Toast.LENGTH_LONG).show()
        } else {
            Toast.makeText(this, "Failed to start installation", Toast.LENGTH_SHORT).show()
        }
    }

    /**
     * Start code-server
     */
    private fun startCodeServer() {
        val result = termuxManager.startCodeServer()
        if (result) {
            Toast.makeText(this, "Starting code-server...", Toast.LENGTH_SHORT).show()
        } else {
            Toast.makeText(this, "Failed to start code-server", Toast.LENGTH_SHORT).show()
        }
    }

    /**
     * Update Termux status UI
     */
    private fun updateTermuxStatusUI(statusInfo: com.yousef.editor.termux.TermuxInfo) {
        val statusText = when (statusInfo.status) {
            TermuxStatus.TERMUX_NOT_INSTALLED -> "Termux not installed"
            TermuxStatus.TERMUX_API_NOT_INSTALLED -> "Termux API not installed"
            TermuxStatus.CODE_SERVER_NOT_INSTALLED -> "code-server not installed"
            TermuxStatus.CODE_SERVER_STOPPED -> "code-server stopped"
            TermuxStatus.CODE_SERVER_RUNNING -> "code-server running on port 8080"
        }

        termuxStatusText.text = statusText
        termuxStatusView.visibility = if (statusInfo.status == TermuxStatus.CODE_SERVER_RUNNING) {
            android.view.View.GONE
        } else {
            android.view.View.VISIBLE
        }
    }

    /**
     * Show loading state
     */
    private fun showLoading(message: String = getString(R.string.checking_connection)) {
        webView.visibility = View.GONE
        errorView.visibility = View.GONE
        loadingView.visibility = View.VISIBLE
        loadingText.text = message
    }

    /**
     * Hide loading state
     */
    private fun hideLoading() {
        loadingView.visibility = View.GONE
    }

    /**
     * Load code-server in WebView
     */
    private fun loadCodeServer() {
        val url = settingsManager.getCodeServerUrl()
        loadUrl(url)
    }

    /**
     * Load URL in WebView
     */
    private fun loadUrl(url: String) {
        showLoading(getString(R.string.loading))
        webView.loadUrl(url)
    }

    /**
     * Show error state
     */
    private fun showError(message: String) {
        webView.visibility = View.GONE
        errorText.text = message
        errorView.visibility = View.VISIBLE
        hideLoading()

        // Accessibility announcement
        errorView.sendAccessibilityEvent(AccessibilityEvent.TYPE_ANNOUNCEMENT)
    }

    /**
     * Install Termux
     */
    private fun installTermux() {
        val intent = Intent(Intent.ACTION_VIEW).apply {
            data = Uri.parse("https://f-droid.org/packages/com.termux/")
        }
        try {
            startActivity(intent)
        } catch (e: Exception) {
            Toast.makeText(this, getString(R.string.install_fdroid), Toast.LENGTH_LONG).show()
        }
    }

    /**
     * Show external URL dialog
     */
    private fun showExternalUrlDialog() {
        val input = android.widget.EditText(this)
        input.hint = getString(R.string.url_hint)
        input.setText(settingsManager.getExternalCodeServerUrl())

        AlertDialog.Builder(this)
            .setTitle(getString(R.string.external_code_server_url))
            .setMessage(getString(R.string.enter_url))
            .setView(input)
            .setPositiveButton(getString(R.string.connect)) { _, _ ->
                val url = input.text.toString()
                if (url.isNotEmpty() && settingsManager.isValidUrl(url)) {
                    settingsManager.setCodeServerUrl(url)

                    // Add new tab
                    val tab = tabManager.addTab(url, "External Server")
                    tabManager.switchToTab(tab.id)
                    loadUrl(url)
                } else {
                    Toast.makeText(this, getString(R.string.url_required), Toast.LENGTH_SHORT).show()
                }
            }
            .setNegativeButton(getString(R.string.cancel), null)
            .show()
    }

    /**
     * Update connection status
     */
    private fun updateConnectionStatus(isConnected: Boolean, url: String) {
        // Status updated via service notification
        val currentTab = tabManager.getCurrentTab()
        currentTab?.let {
            tabManager.updateTabConnection(it.id, isConnected)
        }
    }

    /**
     * Create options menu
     */
    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.main_menu, menu)
        return true
    }

    /**
     * Handle menu item selection
     */
    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_new_tab -> {
                showNewTabDialog()
                true
            }
            R.id.action_external_url -> {
                showExternalUrlDialog()
                true
            }
            R.id.action_refresh -> {
                webView.reload()
                true
            }
            R.id.action_termux_setup -> {
                showTermuxSetupDialog()
                true
            }
            R.id.action_start_code_server -> {
                startCodeServer()
                true
            }
            R.id.action_termux_status -> {
                showTermuxStatusDialog()
                true
            }
            R.id.action_open_termux -> {
                termuxManager.openTermux()
                true
            }
            R.id.action_settings -> {
                openSettings()
                true
            }
            R.id.action_about -> {
                showAboutDialog()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    /**
     * Show new tab dialog
     */
    private fun showNewTabDialog() {
        val input = android.widget.EditText(this)
        input.hint = "http://localhost:8080"

        AlertDialog.Builder(this)
            .setTitle(getString(R.string.new_tab))
            .setMessage(getString(R.string.enter_url))
            .setView(input)
            .setPositiveButton(getString(R.string.connect)) { _, _ ->
                val url = input.text.toString()
                if (url.isNotEmpty() && settingsManager.isValidUrl(url)) {
                    val tab = tabManager.addTab(url, "Tab ${tabManager.getTabCount()}")
                    tabManager.switchToTab(tab.id)
                    loadUrl(url)
                } else {
                    Toast.makeText(this, getString(R.string.url_required), Toast.LENGTH_SHORT).show()
                }
            }
            .setNegativeButton(getString(R.string.cancel), null)
            .show()
    }

    /**
     * Open settings activity
     */
    private fun openSettings() {
        // For now, show a simple settings dialog
        // In a full implementation, this would open a SettingsActivity
        val settings = arrayOf(
            getString(R.string.settings_code_server_url),
            getString(R.string.settings_auto_start),
            getString(R.string.settings_show_notifications)
        )

        AlertDialog.Builder(this)
            .setTitle(getString(R.string.settings))
            .setItems(settings) { _, which ->
                when (which) {
                    0 -> showUrlSettings()
                    1 -> showAutoStartSettings()
                    2 -> showNotificationSettings()
                }
            }
            .setNegativeButton(getString(R.string.cancel), null)
            .show()
    }

    /**
     * Show URL settings
     */
    private fun showUrlSettings() {
        val input = android.widget.EditText(this)
        input.setText(settingsManager.getCodeServerUrl())

        AlertDialog.Builder(this)
            .setTitle(getString(R.string.settings_code_server_url))
            .setView(input)
            .setPositiveButton(getString(R.string.connect)) { _, _ ->
                val url = input.text.toString()
                if (url.isNotEmpty() && settingsManager.isValidUrl(url)) {
                    settingsManager.setCodeServerUrl(url)
                    Toast.makeText(this, "URL updated", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(this, getString(R.string.url_required), Toast.LENGTH_SHORT).show()
                }
            }
            .setNegativeButton(getString(R.string.cancel), null)
            .show()
    }

    /**
     * Show auto-start settings
     */
    private fun showAutoStartSettings() {
        val enabled = settingsManager.isAutoStartEnabled()
        val message = if (enabled) {
            "Auto-start is currently enabled"
        } else {
            "Auto-start is currently disabled"
        }

        AlertDialog.Builder(this)
            .setTitle(getString(R.string.settings_auto_start))
            .setMessage(message)
            .setPositiveButton(if (enabled) "Disable" else "Enable") { _, _ ->
                settingsManager.setAutoStartEnabled(!enabled)
                Toast.makeText(this, "Auto-start ${if (!enabled) "enabled" else "disabled"}", Toast.LENGTH_SHORT).show()
            }
            .setNegativeButton(getString(R.string.cancel), null)
            .show()
    }

    /**
     * Show notification settings
     */
    private fun showNotificationSettings() {
        val enabled = settingsManager.areNotificationsEnabled()
        val message = if (enabled) {
            "Notifications are currently enabled"
        } else {
            "Notifications are currently disabled"
        }

        AlertDialog.Builder(this)
            .setTitle(getString(R.string.settings_show_notifications))
            .setMessage(message)
            .setPositiveButton(if (enabled) "Disable" else "Enable") { _, _ ->
                settingsManager.setNotificationsEnabled(!enabled)
                Toast.makeText(this, "Notifications ${if (!enabled) "enabled" else "disabled"}", Toast.LENGTH_SHORT).show()
            }
            .setNegativeButton(getString(R.string.cancel), null)
            .show()
    }

    /**
     * Show about dialog
     */
    private fun showAboutDialog() {
        val message = """
            ${getString(R.string.about_description)}

            ${getString(R.string.about_version)}

            ${getString(R.string.about_features)}
            ${getString(R.string.about_feature_1)}
            ${getString(R.string.about_feature_2)}
            ${getString(R.string.about_feature_3)}
            ${getString(R.string.about_feature_4)}
            ${getString(R.string.about_feature_5)}
        """.trimIndent()

        AlertDialog.Builder(this)
            .setTitle(getString(R.string.about_title))
            .setMessage(message)
            .setPositiveButton(getString(R.string.connect), null)
            .show()
    }

    /**
     * Show Termux setup dialog
     */
    private fun showTermuxSetupDialog() {
        val statusInfo = termuxManager.getStatusInfo()
        val statusText = when (statusInfo.status) {
            TermuxStatus.TERMUX_NOT_INSTALLED -> "Termux is not installed"
            TermuxStatus.TERMUX_API_NOT_INSTALLED -> "Termux API is not installed"
            TermuxStatus.CODE_SERVER_NOT_INSTALLED -> "code-server is not installed"
            TermuxStatus.CODE_SERVER_STOPPED -> "code-server is installed but not running"
            TermuxStatus.CODE_SERVER_RUNNING -> "code-server is running on port 8080"
        }

        val actions = when (statusInfo.status) {
            TermuxStatus.TERMUX_NOT_INSTALLED -> arrayOf("Install Termux", "Cancel")
            TermuxStatus.TERMUX_API_NOT_INSTALLED -> arrayOf("Install Termux API", "Open Termux", "Cancel")
            TermuxStatus.CODE_SERVER_NOT_INSTALLED -> arrayOf("Install code-server", "Open Termux", "Cancel")
            TermuxStatus.CODE_SERVER_STOPPED -> arrayOf("Start code-server", "Open Termux", "Cancel")
            TermuxStatus.CODE_SERVER_RUNNING -> arrayOf("Stop code-server", "Open Termux", "Close")
        }

        AlertDialog.Builder(this)
            .setTitle("Termux Setup")
            .setMessage("Status: $statusText")
            .setItems(actions) { _, which ->
                when (statusInfo.status) {
                    TermuxStatus.TERMUX_NOT_INSTALLED -> {
                        if (which == 0) {
                            val intent = Intent(Intent.ACTION_VIEW).apply {
                                data = Uri.parse("https://f-droid.org/packages/com.termux/")
                            }
                            startActivity(intent)
                        }
                    }
                    TermuxStatus.TERMUX_API_NOT_INSTALLED -> {
                        when (which) {
                            0 -> {
                                val intent = Intent(Intent.ACTION_VIEW).apply {
                                    data = Uri.parse("https://f-droid.org/packages/com.termux/")
                                }
                                startActivity(intent)
                            }
                            1 -> termuxManager.openTermux()
                        }
                    }
                    TermuxStatus.CODE_SERVER_NOT_INSTALLED -> {
                        when (which) {
                            0 -> installCodeServer()
                            1 -> termuxManager.openTermux()
                        }
                    }
                    TermuxStatus.CODE_SERVER_STOPPED -> {
                        when (which) {
                            0 -> startCodeServer()
                            1 -> termuxManager.openTermux()
                        }
                    }
                    TermuxStatus.CODE_SERVER_RUNNING -> {
                        when (which) {
                            0 -> termuxManager.stopCodeServer()
                            1 -> termuxManager.openTermux()
                        }
                    }
                }
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    /**
     * Show Termux status dialog
     */
    private fun showTermuxStatusDialog() {
        val statusInfo = termuxManager.getStatusInfo()
        val message = """
            Termux Installed: ${if (statusInfo.isTermuxInstalled) "✅ Yes" else "❌ No"}
            Termux API: ${if (statusInfo.isTermuxApiInstalled) "✅ Yes" else "❌ No"}
            code-server Installed: ${if (statusInfo.isCodeServerInstalled) "✅ Yes" else "❌ No"}
            code-server Running: ${if (statusInfo.isCodeServerRunning) "✅ Yes" else "❌ No"}

            URL: ${statusInfo.codeServerUrl.ifEmpty { "N/A" }}
        """.trimIndent()

        AlertDialog.Builder(this)
            .setTitle("Termux Status")
            .setMessage(message)
            .setPositiveButton("OK", null)
            .setNeutralButton("Open Termux") { _, _ ->
                termuxManager.openTermux()
            }
            .show()
    }

    // ServiceConnection implementation
    override fun onServiceConnected(className: ComponentName, service: IBinder) {
        val binder = service as CodeServerService.LocalBinder
        codeServerService = binder.getService()
        serviceBound = true

        // Perform initial connection check
        val url = settingsManager.getCodeServerUrl()
        val isConnected = codeServerService?.performConnectionCheck(url) ?: false
        updateConnectionStatus(isConnected, url)
    }

    override fun onServiceDisconnected(arg0: ComponentName) {
        serviceBound = false
        codeServerService = null
    }

    // TabChangeListener implementation
    override fun onTabAdded(tab: Tab) {
        updateTabUI()
    }

    override fun onTabRemoved(tabId: Long) {
        updateTabUI()
    }

    override fun onTabChanged(oldTabId: Long?, newTabId: Long) {
        val tab = tabManager.getTab(newTabId)
        if (tab != null) {
            loadUrl(tab.url)
        }
        updateTabUI()
    }

    override fun onTabUpdated(tab: Tab) {
        updateTabUI()
    }

    /**
     * Update tab UI
     */
    private fun updateTabUI() {
        val tabs = tabManager.getAllTabs()
        val hasTabs = tabs.isNotEmpty()

        tabContainer.visibility = if (hasTabs) View.VISIBLE else View.GONE
        noTabsView.visibility = if (hasTabs) View.GONE else View.VISIBLE

        if (hasTabs) {
            // Update tab indicators
            // In a full implementation, this would show a horizontal scrollable list of tabs
            val currentTab = tabManager.getCurrentTab()
            currentTab?.let {
                supportActionBar?.title = "${getString(R.string.app_name)} - ${it.title}"
            }
        }
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        if (serviceBound) {
            unbindService(this)
            serviceBound = false
        }
        webView.destroy()
    }

    override fun onResume() {
        super.onResume()
        // Check connection status
        val url = settingsManager.getCodeServerUrl()
        val isConnected = codeServerService?.performConnectionCheck(url) ?: false
        updateConnectionStatus(isConnected, url)
    }
}
