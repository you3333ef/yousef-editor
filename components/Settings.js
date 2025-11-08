import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert} from 'react-native';

const Settings = ({isDesktopMode, onToggleMode}) => {
  const [settings, setSettings] = useState({
    darkTheme: true,
    autoSave: true,
    showMinimap: true,
    fontSize: 14,
    wordWrap: true,
    showLineNumbers: true,
    codeServerPort: '8080',
    terminalTheme: 'dark',
    autoComplete: true,
    showWhitespace: false,
  });

  const [isEditingPort, setIsEditingPort] = useState(false);

  const updateSetting = (key, value) => {
    setSettings(prev => ({...prev, [key]: value}));
  };

  const resetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setSettings({
              darkTheme: true,
              autoSave: true,
              showMinimap: true,
              fontSize: 14,
              wordWrap: true,
              showLineNumbers: true,
              codeServerPort: '8080',
              terminalTheme: 'dark',
              autoComplete: true,
              showWhitespace: false,
            });
          },
        },
      ]
    );
  };

  const exportSettings = () => {
    Alert.alert('Export Settings', 'Settings exported to /yousef-editor/settings.json');
  };

  const importSettings = () => {
    Alert.alert('Import Settings', 'Settings imported successfully');
  };

  const renderSettingRow = (title, description, children) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      {children}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Display Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Display</Text>

        {renderSettingRow(
          'Desktop Mode',
          'Toggle between mobile and desktop layout',
          <Switch
            value={isDesktopMode}
            onValueChange={onToggleMode}
            trackColor={{false: '#3e3e42', true: '#0e639c'}}
            thumbColor={isDesktopMode ? '#ffffff' : '#f4f3f4'}
          />
        )}

        {renderSettingRow(
          'Dark Theme',
          'Use dark theme for the interface',
          <Switch
            value={settings.darkTheme}
            onValueChange={(value) => updateSetting('darkTheme', value)}
            trackColor={{false: '#3e3e42', true: '#0e639c'}}
          />
        )}

        {renderSettingRow(
          'Font Size',
          `${settings.fontSize}px`,
          <View style={styles.fontSizeControls}>
            <TouchableOpacity
              style={styles.sizeButton}
              onPress={() => updateSetting('fontSize', Math.max(10, settings.fontSize - 1))}>
              <Text style={styles.sizeButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.fontSizeValue}>{settings.fontSize}</Text>
            <TouchableOpacity
              style={styles.sizeButton}
              onPress={() => updateSetting('fontSize', Math.min(24, settings.fontSize + 1))}>
              <Text style={styles.sizeButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Editor Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Code Editor</Text>

        {renderSettingRow(
          'Show Line Numbers',
          'Display line numbers in the editor',
          <Switch
            value={settings.showLineNumbers}
            onValueChange={(value) => updateSetting('showLineNumbers', value)}
            trackColor={{false: '#3e3e42', true: '#0e639c'}}
          />
        )}

        {renderSettingRow(
          'Word Wrap',
          'Wrap long lines to the next line',
          <Switch
            value={settings.wordWrap}
            onValueChange={(value) => updateSetting('wordWrap', value)}
            trackColor={{false: '#3e3e42', true: '#0e639c'}}
          />
        )}

        {renderSettingRow(
          'Show Minimap',
          'Display code minimap on the right side',
          <Switch
            value={settings.showMinimap}
            onValueChange={(value) => updateSetting('showMinimap', value)}
            trackColor={{false: '#3e3e42', true: '#0e639c'}}
          />
        )}

        {renderSettingRow(
          'Auto Complete',
          'Enable intelligent code completion',
          <Switch
            value={settings.autoComplete}
            onValueChange={(value) => updateSetting('autoComplete', value)}
            trackColor={{false: '#3e3e42', true: '#0e639c'}}
          />
        )}

        {renderSettingRow(
          'Show Whitespace',
          'Display whitespace characters',
          <Switch
            value={settings.showWhitespace}
            onValueChange={(value) => updateSetting('showWhitespace', value)}
            trackColor={{false: '#3e3e42', true: '#0e639c'}}
          />
        )}
      </View>

      {/* Code-Server Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Code-Server</Text>

        {renderSettingRow(
          'Auto Save',
          'Automatically save files on change',
          <Switch
            value={settings.autoSave}
            onValueChange={(value) => updateSetting('autoSave', value)}
            trackColor={{false: '#3e3e42', true: '#0e639c'}}
          />
        )}

        {renderSettingRow(
          'Server Port',
          `Port ${settings.codeServerPort}`,
          <TouchableOpacity
            style={styles.portButton}
            onPress={() => setIsEditingPort(true)}>
            <Text style={styles.portButtonText}>Change</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Terminal Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Terminal</Text>

        {renderSettingRow(
          'Terminal Theme',
          settings.terminalTheme,
          <View style={styles.themeSelector}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                settings.terminalTheme === 'dark' && styles.themeButtonActive
              ]}
              onPress={() => updateSetting('terminalTheme', 'dark')}>
              <Text style={styles.themeButtonText}>Dark</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                settings.terminalTheme === 'light' && styles.themeButtonActive
              ]}
              onPress={() => updateSetting('terminalTheme', 'light')}>
              <Text style={styles.themeButtonText}>Light</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* System Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System</Text>

        <View style={styles.systemInfo}>
          <Text style={styles.systemInfoTitle}>Application Info</Text>
          <Text style={styles.systemInfoItem}>Version: 1.0.0</Text>
          <Text style={styles.systemInfoItem}>React Native: 0.72.0</Text>
          <Text style={styles.systemInfoItem}>Engine: JavaScriptCore</Text>
          <Text style={styles.systemInfoItem}>Platform: Android</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>

        <TouchableOpacity style={styles.actionButton} onPress={exportSettings}>
          <Text style={styles.actionButtonText}>📤 Export Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={importSettings}>
          <Text style={styles.actionButtonText}>📥 Import Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={resetSettings}>
          <Text style={styles.resetButtonText}>🔄 Reset to Default</Text>
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <View style={styles.aboutContent}>
          <Text style={styles.appName}>Yousef Editor</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appDescription}>
            A powerful code editor for Android with code-server integration
          </Text>
          <Text style={styles.appFeatures}>
            Features:{'\n'}
            • VS Code in browser{'\n'}
            • Multi-tab support{'\n'}
            • Integrated terminal{'\n'}
            • Project management{'\n'}
            • File explorer
          </Text>
          <Text style={styles.copyright}>
            © 2024 Yousef Editor. All rights reserved.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  section: {
    backgroundColor: '#252526',
    marginTop: 12,
    padding: 12,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3e3e42',
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    color: '#999999',
    fontSize: 12,
  },
  fontSizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sizeButton: {
    backgroundColor: '#3e3e42',
    width: 32,
    height: 32,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  fontSizeValue: {
    color: '#ffffff',
    fontSize: 16,
    minWidth: 30,
    textAlign: 'center',
  },
  portButton: {
    backgroundColor: '#0e639c',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  portButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  themeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  themeButton: {
    backgroundColor: '#3e3e42',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  themeButtonActive: {
    backgroundColor: '#0e639c',
  },
  themeButtonText: {
    color: '#ffffff',
    fontSize: 12,
  },
  systemInfo: {
    backgroundColor: '#2d2d30',
    padding: 12,
    borderRadius: 4,
  },
  systemInfoTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  systemInfoItem: {
    color: '#cccccc',
    fontSize: 12,
    marginBottom: 4,
  },
  actionButton: {
    backgroundColor: '#3e3e42',
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  resetButton: {
    backgroundColor: '#c50e1f',
    padding: 12,
    borderRadius: 4,
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  aboutContent: {
    alignItems: 'center',
    padding: 12,
  },
  appName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appVersion: {
    color: '#0e639c',
    fontSize: 16,
    marginBottom: 12,
  },
  appDescription: {
    color: '#cccccc',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  appFeatures: {
    color: '#999999',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
  },
  copyright: {
    color: '#666666',
    fontSize: 10,
    textAlign: 'center',
  },
});

export default Settings;
