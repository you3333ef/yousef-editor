import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Switch, Alert} from 'react-native';

const StartupConfig = () => {
  const [startupSettings, setStartupSettings] = useState({
    startMode: 'code-server', // code-server, workspace, home
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

  const modes = [
    { id: 'code-server', name: 'Code-Server Only', description: 'Start directly with VS Code' },
    { id: 'workspace', name: 'Multi-Tab Workspace', description: 'Open full workspace with tabs' },
    { id: 'home', name: 'Home Screen', description: 'Show home screen with options' },
  ];

  const updateSetting = (key, value) => {
    setStartupSettings(prev => ({...prev, [key]: value}));
  };

  const loadLastSession = () => {
    // In real implementation, load from AsyncStorage
    Alert.alert('Load Session', 'Loading last session...\n\nProjects: yousef-editor\nLast tab: Code Editor');
  };

  const resetStartup = () => {
    Alert.alert(
      'Reset Startup',
      'Reset all startup settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: () => {
            setStartupSettings({
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
            Alert.alert('Reset Complete', 'Startup settings reset to default');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Startup Mode */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚀 Startup Mode</Text>
        <Text style={styles.description}>
          Choose what happens when you open the app
        </Text>

        {modes.map(mode => (
          <TouchableOpacity
            key={mode.id}
            style={[
              styles.modeOption,
              startupSettings.startMode === mode.id && styles.modeOptionActive
            ]}
            onPress={() => updateSetting('startMode', mode.id)}>
            <View style={styles.modeHeader}>
              <Text style={[
                styles.modeName,
                startupSettings.startMode === mode.id && styles.modeNameActive
              ]}>
                {mode.name}
              </Text>
              {startupSettings.startMode === mode.id && (
                <Text style={styles.checkMark}>✓</Text>
              )}
            </View>
            <Text style={[
              styles.modeDescription,
              startupSettings.startMode === mode.id && styles.modeDescriptionActive
            ]}>
              {mode.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Code-Server Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Code-Server</Text>

        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Auto-Start Code-Server</Text>
            <Text style={styles.toggleDescription}>Start code-server automatically on app launch</Text>
          </View>
          <Switch
            value={startupSettings.autoStartCodeServer}
            onValueChange={(value) => updateSetting('autoStartCodeServer', value)}
            trackColor={{false: '#3e3e42', true: '#0e639c'}}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Custom Code-Server URL</Text>
          <TextInput
            style={styles.input}
            value={startupSettings.customWorkspace}
            onChangeText={(text) => updateSetting('customWorkspace', text)}
            placeholder="http://localhost:8080"
            placeholderTextColor="#666"
          />
          <Text style={styles.hint}>
            Use custom URL if code-server is running elsewhere
          </Text>
        </View>
      </View>

      {/* Workspace Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📂 Workspace</Text>

        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Restore Last Session</Text>
            <Text style={styles.toggleDescription}>Open tabs and projects from last session</Text>
          </View>
          <Switch
            value={startupSettings.restoreSession}
            onValueChange={(value) => updateSetting('restoreSession', value)}
            trackColor={{false: '#3e3e42', true: '#0e639c'}}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Open Last Project</Text>
            <Text style={styles.toggleDescription}>Automatically open the last opened project</Text>
          </View>
          <Switch
            value={startupSettings.openLastProject}
            onValueChange={(value) => updateSetting('openLastProject', value)}
            trackColor={{false: '#3e3e42', true: '#0e639c'}}
          />
        </View>

        {startupSettings.openLastProject && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Project</Text>
            <TouchableOpacity style={styles.projectDisplay} onPress={loadLastSession}>
              <Text style={styles.projectText}>
                {startupSettings.lastProject || 'No project selected'}
              </Text>
              <Text style={styles.loadButton}>📂</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Start in Desktop Mode</Text>
            <Text style={styles.toggleDescription}>Launch app in desktop layout</Text>
          </View>
          <Switch
            value={startupSettings.startInDesktopMode}
            onValueChange={(value) => updateSetting('startInDesktopMode', value)}
            trackColor={{false: '#3e3e42', true: '#0e639c'}}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Auto-Focus Terminal</Text>
            <Text style={styles.toggleDescription}>Focus terminal on startup</Text>
          </View>
          <Switch
            value={startupSettings.autoFocusTerminal}
            onValueChange={(value) => updateSetting('autoFocusTerminal', value)}
            trackColor={{false: '#3e3e42', true: '#0e639c'}}
          />
        </View>
      </View>

      {/* Welcome Screen */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👋 Welcome Screen</Text>

        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Show Welcome Screen</Text>
            <Text style={styles.toggleDescription}>Display welcome message and tips</Text>
          </View>
          <Switch
            value={startupSettings.showWelcomeScreen}
            onValueChange={(value) => updateSetting('showWelcomeScreen', value)}
            trackColor={{false: '#3e3e42', true: '#0e639c'}}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>

        <TouchableOpacity style={styles.actionButton} onPress={loadLastSession}>
          <Text style={styles.actionButtonText}>📂 Load Last Session</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>🎯 Create Quick Workspace</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>🔌 Connect to Remote</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>📋 Import Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Reset */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.resetButton} onPress={resetStartup}>
          <Text style={styles.resetButtonText}>🔄 Reset to Default</Text>
        </TouchableOpacity>
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
    padding: 16,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#999999',
    fontSize: 13,
    marginBottom: 16,
  },
  modeOption: {
    backgroundColor: '#3c3c3c',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  modeOptionActive: {
    backgroundColor: '#0e639c',
  },
  modeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modeName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
  },
  modeNameActive: {
    fontWeight: 'bold',
  },
  checkMark: {
    color: '#ffffff',
    fontSize: 16,
  },
  modeDescription: {
    color: '#cccccc',
    fontSize: 12,
    marginTop: 4,
  },
  modeDescriptionActive: {
    color: '#f0f0f0',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3e3e42',
  },
  toggleInfo: {
    flex: 1,
    marginRight: 12,
  },
  toggleTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  toggleDescription: {
    color: '#999999',
    fontSize: 12,
  },
  inputGroup: {
    marginVertical: 12,
  },
  label: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#3c3c3c',
    color: '#ffffff',
    padding: 12,
    borderRadius: 4,
    fontSize: 14,
  },
  hint: {
    color: '#999999',
    fontSize: 11,
    marginTop: 4,
  },
  projectDisplay: {
    backgroundColor: '#3c3c3c',
    padding: 12,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectText: {
    color: '#ffffff',
    fontSize: 14,
    flex: 1,
  },
  loadButton: {
    fontSize: 18,
  },
  actionButton: {
    backgroundColor: '#3e3e42',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  resetButton: {
    backgroundColor: '#c50e1f',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default StartupConfig;
