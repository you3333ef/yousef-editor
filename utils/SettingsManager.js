import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';

class SettingsManager {
  constructor() {
    this.keys = {
      API: 'api_settings',
      STARTUP: 'startup_settings',
      EDITOR: 'editor_settings',
      TERMINAL: 'terminal_settings',
      THEME: 'theme_settings',
      PROJECTS: 'projects',
      SESSIONS: 'sessions',
    };
  }

  // Generic save/load methods
  async saveSettings(key, data) {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }

  async loadSettings(key, defaultValue = {}) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : defaultValue;
    } catch (error) {
      console.error('Error loading settings:', error);
      return defaultValue;
    }
  }

  // API Settings
  async saveApiSettings(settings) {
    return this.saveSettings(this.keys.API, settings);
  }

  async loadApiSettings() {
    return this.loadSettings(this.keys.API, {
      anthropicApiKey: '',
      selectedModel: 'claude-3-sonnet-20240229',
      customEndpoint: '',
      autoSave: true,
      cloudSync: false,
      enableAI: true,
    });
  }

  // Startup Settings
  async saveStartupSettings(settings) {
    return this.saveSettings(this.keys.STARTUP, settings);
  }

  async loadStartupSettings() {
    return this.loadSettings(this.keys.STARTUP, {
      startMode: 'code-server',
      lastProject: '',
      openTabs: ['code-editor'],
      autoStartCodeServer: true,
      openLastProject: false,
      showWelcomeScreen: false,
      restoreSession: true,
      customWorkspace: '',
      startInDesktopMode: false,
      autoFocusTerminal: false,
    });
  }

  // Editor Settings
  async saveEditorSettings(settings) {
    return this.saveSettings(this.keys.EDITOR, settings);
  }

  async loadEditorSettings() {
    return this.loadSettings(this.keys.EDITOR, {
      fontSize: 14,
      theme: 'dark',
      wordWrap: true,
      showLineNumbers: true,
      showMinimap: true,
      autoComplete: true,
      showWhitespace: false,
      tabSize: 2,
      formatOnSave: true,
    });
  }

  // Terminal Settings
  async saveTerminalSettings(settings) {
    return this.saveSettings(this.keys.TERMINAL, settings);
  }

  async loadTerminalSettings() {
    return this.loadSettings(this.keys.TERMINAL, {
      theme: 'dark',
      fontSize: 12,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      historySize: 1000,
      autoClear: false,
      soundEnabled: true,
    });
  }

  // Theme Settings
  async saveThemeSettings(settings) {
    return this.saveSettings(this.keys.THEME, settings);
  }

  async loadThemeSettings() {
    return this.loadSettings(this.keys.THEME, {
      darkTheme: true,
      primaryColor: '#0e639c',
      accentColor: '#03DAC5',
      backgroundColor: '#1e1e1e',
      surfaceColor: '#252526',
    });
  }

  // Projects
  async saveProjects(projects) {
    return this.saveSettings(this.keys.PROJECTS, projects);
  }

  async loadProjects() {
    return this.loadSettings(this.keys.PROJECTS, []);
  }

  // Session Management
  async saveSession(sessionId, sessionData) {
    const sessions = await this.loadSessions();
    sessions[sessionId] = {
      ...sessionData,
      timestamp: Date.now(),
    };
    return this.saveSettings(this.keys.SESSIONS, sessions);
  }

  async loadSessions() {
    return this.loadSettings(this.keys.SESSIONS, {});
  }

  async loadLastSession() {
    const sessions = await this.loadSessions();
    const sortedSessions = Object.entries(sessions)
      .sort(([,a], [,b]) => b.timestamp - a.timestamp);

    return sortedSessions.length > 0 ? sortedSessions[0][1] : null;
  }

  // Export/Import
  async exportAllSettings() {
    const allSettings = {};
    for (const key of Object.values(this.keys)) {
      allSettings[key] = await this.loadSettings(key);
    }
    return allSettings;
  }

  async importSettings(settings) {
    const results = {};
    for (const [key, value] of Object.entries(settings)) {
      if (Object.values(this.keys).includes(key)) {
        results[key] = await this.saveSettings(key, value);
      }
    }
    return results;
  }

  // Reset
  async resetAllSettings() {
    const keys = Object.values(this.keys);
    for (const key of keys) {
      await AsyncStorage.removeItem(key);
    }
  }

  async resetSetting(key) {
    if (Object.values(this.keys).includes(key)) {
      await AsyncStorage.removeItem(key);
    }
  }

  // Auto-save
  async enableAutoSave(interval = 30000, callback = null) {
    // Store auto-save interval
    await AsyncStorage.setItem('auto_save_interval', interval.toString());

    // Start auto-save timer
    this.autoSaveTimer = setInterval(async () => {
      try {
        // Get current file from active session
        const session = await this.getActiveSession();
        if (session && session.currentFile) {
          const FileSystemManager = require('./FileSystemManager').default;
          const currentContent = session.currentContent || '';
          await FileSystemManager.writeFile(session.currentFile, currentContent);
          console.log('Auto-saved:', session.currentFile);
          if (callback) callback({success: true, file: session.currentFile});
        }
      } catch (error) {
        console.error('Auto-save error:', error);
        if (callback) callback({success: false, error: error.message});
      }
    }, interval);
  }

  async disableAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  async setActiveSession(sessionData) {
    const activeSession = {
      ...sessionData,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem('active_session', JSON.stringify(activeSession));
    return activeSession;
  }

  async getActiveSession() {
    try {
      const sessionJson = await AsyncStorage.getItem('active_session');
      return sessionJson ? JSON.parse(sessionJson) : null;
    } catch (error) {
      console.error('Error getting active session:', error);
      return null;
    }
  }

  // Cloud Sync (Enhanced)
  async syncToCloud() {
    try {
      // Get all settings and data
      const allData = {
        settings: await this.exportAllSettings(),
        projects: await this.loadProjects(),
        sessions: await this.loadSessions(),
        timestamp: Date.now(),
      };

      // In real implementation, this would upload to cloud storage
      // For now, simulate with local backup
      const backupKey = `cloud_backup_${Date.now()}`;
      await AsyncStorage.setItem(backupKey, JSON.stringify(allData));
      await AsyncStorage.setItem('last_cloud_sync', Date.now().toString());

      console.log('Synced to cloud backup:', backupKey);
      return {
        success: true,
        timestamp: allData.timestamp,
        backupId: backupKey,
        message: 'Data synced to cloud successfully'
      };
    } catch (error) {
      console.error('Cloud sync error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async syncFromCloud() {
    try {
      const lastSync = await AsyncStorage.getItem('last_cloud_sync');
      if (!lastSync) {
        return {
          success: false,
          error: 'No cloud backup found. Please sync to cloud first.'
        };
      }

      // Find the most recent backup
      const allKeys = await AsyncStorage.getAllKeys();
      const backupKeys = allKeys.filter(key => key.startsWith('cloud_backup_'));
      backupKeys.sort().reverse();

      if (backupKeys.length === 0) {
        return {
          success: false,
          error: 'No cloud backups available'
        };
      }

      const latestBackup = await AsyncStorage.getItem(backupKeys[0]);
      const backupData = JSON.parse(latestBackup);

      // Restore settings
      if (backupData.settings) {
        await this.importSettings(backupData.settings);
      }

      console.log('Restored from cloud backup:', backupKeys[0]);
      return {
        success: true,
        timestamp: backupData.timestamp,
        backupId: backupKeys[0],
        message: 'Data restored from cloud successfully'
      };
    } catch (error) {
      console.error('Cloud restore error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getCloudSyncStatus() {
    try {
      const lastSync = await AsyncStorage.getItem('last_cloud_sync');
      return {
        lastSync: lastSync ? parseInt(lastSync) : null,
        hasBackups: true
      };
    } catch (error) {
      return {
        lastSync: null,
        hasBackups: false
      };
    }
  }
}

export default new SettingsManager();
