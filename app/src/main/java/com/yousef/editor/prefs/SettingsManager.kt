package com.yousef.editor.prefs

import android.content.Context
import android.content.SharedPreferences

/**
 * SettingsManager - Inspired by VHEditor-Android preferences
 *
 * Manages all app settings:
 * - Code-server URL
 * - Auto-start service
 * - Notification settings
 * - Theme selection
 * - Connection check interval
 */
class SettingsManager(private val context: Context) {

    companion object {
        const val PREFS_NAME = "yousef_editor_prefs"
        const val KEY_CODE_SERVER_URL = "code_server_url"
        const val KEY_AUTO_START = "auto_start_service"
        const val KEY_SHOW_NOTIFICATIONS = "show_notifications"
        const val KEY_THEME = "theme"
        const val KEY_CHECK_INTERVAL = "check_interval"
        const val KEY_WAKE_LOCK = "wake_lock"
        const val KEY_KEEP_SCREEN_ON = "keep_screen_on"
        const val KEY_USER_AGENT = "user_agent"
    }

    private val prefs: SharedPreferences =
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    private val editor: SharedPreferences.Editor
        get() = prefs.edit()

    // Code Server URL Settings
    fun getCodeServerUrl(): String {
        return prefs.getString(KEY_CODE_SERVER_URL, "http://localhost:8080")!!
    }

    fun setCodeServerUrl(url: String) {
        editor.putString(KEY_CODE_SERVER_URL, url).apply()
    }

    fun getDefaultCodeServerUrl(): String {
        return "http://localhost:8080"
    }

    fun getExternalCodeServerUrl(): String {
        return prefs.getString(KEY_CODE_SERVER_URL, "http://192.168.1.1:8080")!!
    }

    // Auto-start Settings
    fun isAutoStartEnabled(): Boolean {
        return prefs.getBoolean(KEY_AUTO_START, false)
    }

    fun setAutoStartEnabled(enabled: Boolean) {
        editor.putBoolean(KEY_AUTO_START, enabled).apply()
    }

    // Notification Settings
    fun areNotificationsEnabled(): Boolean {
        return prefs.getBoolean(KEY_SHOW_NOTIFICATIONS, true)
    }

    fun setNotificationsEnabled(enabled: Boolean) {
        editor.putBoolean(KEY_SHOW_NOTIFICATIONS, enabled).apply()
    }

    // Theme Settings
    fun getTheme(): String {
        return prefs.getString(KEY_THEME, "auto") ?: "auto"
    }

    fun setTheme(theme: String) {
        editor.putString(KEY_THEME, theme).apply()
    }

    // Connection Check Interval
    fun getCheckInterval(): Int {
        return prefs.getInt(KEY_CHECK_INTERVAL, 5000)
    }

    fun setCheckInterval(intervalMs: Int) {
        editor.putInt(KEY_CHECK_INTERVAL, intervalMs).apply()
    }

    // Wake Lock Settings
    fun isWakeLockEnabled(): Boolean {
        return prefs.getBoolean(KEY_WAKE_LOCK, true)
    }

    fun setWakeLockEnabled(enabled: Boolean) {
        editor.putBoolean(KEY_WAKE_LOCK, enabled).apply()
    }

    // Keep Screen On
    fun isKeepScreenOnEnabled(): Boolean {
        return prefs.getBoolean(KEY_KEEP_SCREEN_ON, false)
    }

    fun setKeepScreenOnEnabled(enabled: Boolean) {
        editor.putBoolean(KEY_KEEP_SCREEN_ON, enabled).apply()
    }

    // User Agent
    fun getUserAgent(): String {
        return prefs.getString(KEY_USER_AGENT, "YousefEditor/1.0")
            ?: "YousefEditor/1.0"
    }

    fun setUserAgent(userAgent: String) {
        editor.putString(KEY_USER_AGENT, userAgent).apply()
    }

    // Clear all settings
    fun clear() {
        editor.clear().apply()
    }

    // Export settings
    fun exportSettings(): Map<String, *> {
        return prefs.all
    }

    // Import settings
    fun importSettings(settings: Map<String, *>) {
        editor.clear()
        settings.forEach { (key, value) ->
            when (value) {
                is String -> editor.putString(key, value)
                is Int -> editor.putInt(key, value)
                is Long -> editor.putLong(key, value)
                is Float -> editor.putFloat(key, value)
                is Boolean -> editor.putBoolean(key, value)
            }
        }
        editor.apply()
    }

    // Reset to defaults
    fun resetToDefaults() {
        editor.putString(KEY_CODE_SERVER_URL, getDefaultCodeServerUrl())
        editor.putBoolean(KEY_AUTO_START, false)
        editor.putBoolean(KEY_SHOW_NOTIFICATIONS, true)
        editor.putString(KEY_THEME, "auto")
        editor.putInt(KEY_CHECK_INTERVAL, 5000)
        editor.putBoolean(KEY_WAKE_LOCK, true)
        editor.putBoolean(KEY_KEEP_SCREEN_ON, false)
        editor.putString(KEY_USER_AGENT, "YousefEditor/1.0")
        editor.apply()
    }

    // Validate URL
    fun isValidUrl(url: String): Boolean {
        return url.startsWith("http://") || url.startsWith("https://")
    }

    // Get all available themes
    fun getAvailableThemes(): List<ThemeOption> {
        return listOf(
            ThemeOption("auto", "System Default"),
            ThemeOption("light", "Light"),
            ThemeOption("dark", "Dark"),
            ThemeOption("sepia", "Sepia")
        )
    }

    // Get all available check intervals
    fun getAvailableCheckIntervals(): List<CheckIntervalOption> {
        return listOf(
            CheckIntervalOption(3000, "3 seconds"),
            CheckIntervalOption(5000, "5 seconds"),
            CheckIntervalOption(10000, "10 seconds"),
            CheckIntervalOption(30000, "30 seconds"),
            CheckIntervalOption(60000, "1 minute")
        )
    }

    data class ThemeOption(val value: String, val displayName: String)
    data class CheckIntervalOption(val milliseconds: Int, val displayName: String)
}
