package com.yousef.editor.tabs

import android.content.Context
import android.content.SharedPreferences
import android.util.Log
import com.yousef.editor.prefs.SettingsManager
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.atomic.AtomicLong

/**
 * TabManager - Inspired by VHEditor-Android tab management
 *
 * Manages multiple code-server tabs:
 * - Add/remove tabs
 * - Switch between tabs
 * - Persist tab state
 * - Handle tab lifecycle
 */
class TabManager(private val context: Context) {

    companion object {
        const val TAG = "TabManager"
        const val PREFS_TABS = "saved_tabs"
        private val tabIdGenerator = AtomicLong(0)
    }

    private val tabs = ConcurrentHashMap<Long, Tab>()
    private val settings = SettingsManager(context)
    private var currentTabId: Long? = null

    // Tab data class
    data class Tab(
        val id: Long = tabIdGenerator.incrementAndGet(),
        val title: String,
        val url: String,
        val isConnected: Boolean = false,
        val lastVisited: Long = System.currentTimeMillis(),
        val createdAt: Long = System.currentTimeMillis()
    ) {
        fun getDisplayTitle(): String {
            return if (title.isEmpty()) {
                "Tab ${id}"
            } else {
                title
            }
        }

        fun isLocal(): Boolean {
            return url.contains("localhost") ||
                    url.contains("127.0.0.1") ||
                    url.contains("10.0.2.2")
        }
    }

    // Tab change listener
    interface TabChangeListener {
        fun onTabAdded(tab: Tab)
        fun onTabRemoved(tabId: Long)
        fun onTabChanged(oldTabId: Long?, newTabId: Long)
        fun onTabUpdated(tab: Tab)
    }

    private var listeners = mutableListOf<TabChangeListener>()

    /**
     * Add a new tab
     */
    fun addTab(url: String, title: String? = null): Tab {
        val tabTitle = title ?: getDefaultTitle(url)
        val tab = Tab(title = tabTitle, url = url)

        tabs[tab.id] = tab
        currentTabId = tab.id

        notifyTabAdded(tab)
        notifyTabChanged(null, tab.id)

        saveTabs()
        Log.d(TAG, "Added tab: ${tab.title} - $url")

        return tab
    }

    /**
     * Remove a tab
     */
    fun removeTab(tabId: Long): Boolean {
        val tab = tabs.remove(tabId) ?: return false

        // If this was the current tab, switch to another tab
        if (currentTabId == tabId) {
            currentTabId = tabs.values.firstOrNull()?.id
            val newTabId = currentTabId ?: 0L
            notifyTabChanged(tabId, newTabId)
        }

        notifyTabRemoved(tabId)
        saveTabs()

        Log.d(TAG, "Removed tab: ${tab.title}")
        return true
    }

    /**
     * Get all tabs
     */
    fun getAllTabs(): List<Tab> {
        return tabs.values.sortedBy { it.createdAt }
    }

    /**
     * Get current tab
     */
    fun getCurrentTab(): Tab? {
        return currentTabId?.let { tabs[it] }
    }

    /**
     * Get current tab ID
     */
    fun getCurrentTabId(): Long? = currentTabId

    /**
     * Switch to a tab
     */
    fun switchToTab(tabId: Long): Boolean {
        if (!tabs.containsKey(tabId)) return false

        val oldTabId = currentTabId
        currentTabId = tabId

        // Update last visited time
        tabs[tabId]?.let { tab ->
            tabs[tabId] = tab.copy(lastVisited = System.currentTimeMillis())
        }

        notifyTabChanged(oldTabId, tabId)
        saveTabs()

        Log.d(TAG, "Switched to tab: ${tabs[tabId]?.title}")
        return true
    }

    /**
     * Update tab connection status
     */
    fun updateTabConnection(tabId: Long, isConnected: Boolean) {
        val tab = tabs[tabId] ?: return
        tabs[tabId] = tab.copy(isConnected = isConnected)
        notifyTabUpdated(tab)
        saveTabs()
    }

    /**
     * Update tab title
     */
    fun updateTabTitle(tabId: Long, title: String) {
        val tab = tabs[tabId] ?: return
        tabs[tabId] = tab.copy(title = title)
        notifyTabUpdated(tab)
        saveTabs()
    }

    /**
     * Get tab by ID
     */
    fun getTab(tabId: Long): Tab? = tabs[tabId]

    /**
     * Get tab count
     */
    fun getTabCount(): Int = tabs.size

    /**
     * Clear all tabs
     */
    fun clearAllTabs() {
        val oldTabId = currentTabId
        tabs.clear()
        currentTabId = null

        notifyTabChanged(oldTabId, -1)
        saveTabs()

        Log.d(TAG, "Cleared all tabs")
    }

    /**
     * Add listener
     */
    fun addListener(listener: TabChangeListener) {
        listeners.add(listener)
    }

    /**
     * Remove listener
     */
    fun removeListener(listener: TabChangeListener) {
        listeners.remove(listener)
    }

    /**
     * Save tabs to preferences
     */
    private fun saveTabs() {
        try {
            val prefs = context.getSharedPreferences(PREFS_TABS, Context.MODE_PRIVATE)
            val editor = prefs.edit()

            editor.putInt("tab_count", tabs.size)
            editor.putLong("current_tab_id", currentTabId ?: -1)

            tabs.forEach { (id, tab) ->
                editor.putString("tab_${id}_title", tab.title)
                editor.putString("tab_${id}_url", tab.url)
                editor.putBoolean("tab_${id}_connected", tab.isConnected)
                editor.putLong("tab_${id}_last_visited", tab.lastVisited)
                editor.putLong("tab_${id}_created", tab.createdAt)
            }

            editor.apply()
        } catch (e: Exception) {
            Log.e(TAG, "Failed to save tabs", e)
        }
    }

    /**
     * Load tabs from preferences
     */
    fun loadTabs() {
        try {
            val prefs = context.getSharedPreferences(PREFS_TABS, Context.MODE_PRIVATE)
            val tabCount = prefs.getInt("tab_count", 0)

            tabs.clear()

            for (i in 0 until tabCount) {
                val id = prefs.getLong("tab_${i}_id", -1)
                if (id != -1L) {
                    val tab = Tab(
                        id = id,
                        title = prefs.getString("tab_${i}_title", "") ?: "",
                        url = prefs.getString("tab_${i}_url", "") ?: "",
                        isConnected = prefs.getBoolean("tab_${i}_connected", false),
                        lastVisited = prefs.getLong("tab_${i}_last_visited", 0),
                        createdAt = prefs.getLong("tab_${i}_created", 0)
                    )
                    tabs[tab.id] = tab
                }
            }

            val currentId = prefs.getLong("current_tab_id", -1)
            if (currentId != -1L && tabs.containsKey(currentId)) {
                currentTabId = currentId
            } else if (tabs.isNotEmpty()) {
                currentTabId = tabs.keys.first()
            }

            Log.d(TAG, "Loaded ${tabs.size} tabs")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to load tabs", e)
        }
    }

    /**
     * Get default title for URL
     */
    private fun getDefaultTitle(url: String): String {
        return when {
            url.contains("localhost") || url.contains("127.0.0.1") -> "Local Server"
            url.contains("github") -> "GitHub"
            url.contains("stackoverflow") -> "Stack Overflow"
            url.contains("gitlab") -> "GitLab"
            url.contains("bitbucket") -> "Bitbucket"
            else -> {
                val domain = try {
                    val start = url.indexOf("://") + 3
                    val end = url.indexOf("/", start)
                    if (end > 0) url.substring(start, end) else url.substring(start)
                } catch (e: Exception) {
                    "Tab"
                }
                domain
            }
        }
    }

    // Notify listeners
    private fun notifyTabAdded(tab: Tab) {
        listeners.forEach { it.onTabAdded(tab) }
    }

    private fun notifyTabRemoved(tabId: Long) {
        listeners.forEach { it.onTabRemoved(tabId) }
    }

    private fun notifyTabChanged(oldTabId: Long?, newTabId: Long) {
        listeners.forEach { it.onTabChanged(oldTabId, newTabId) }
    }

    private fun notifyTabUpdated(tab: Tab) {
        listeners.forEach { it.onTabUpdated(tab) }
    }
}
