import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert, TextInput, FlatList} from 'react-native';
import AIProvider from '../services/AIProvider';
import SettingsManager from '../utils/SettingsManager';

const Settings = ({isDesktopMode, onToggleMode}) => {
  const [settings, setSettings] = useState({
    selectedProvider: 'anthropic',
    anthropicApiKey: '',
    openaiApiKey: '',
    googleApiKey: '',
    cohereApiKey: '',
    togetherApiKey: '',
    openrouterApiKey: '',
    minimaxApiKey: '',
    selectedModel: 'claude-3-sonnet-20240229',
    customEndpoint: '',
    darkTheme: true,
    autoSave: true,
    showMinimap: true,
    fontSize: 14,
    wordWrap: true,
    showLineNumbers: true,
    codeServerPort: '8080',
    startMode: 'code-server',
    autoStartCodeServer: true,
    restoreSession: true,
    startInDesktopMode: false,
  });

  const [showApiKey, setShowApiKey] = useState({
    anthropic: false,
    openai: false,
    google: false,
    cohere: false,
    together: false,
    openrouter: false,
    minimax: false,
  });
  const [activeTab, setActiveTab] = useState('api');
  const [providers, setProviders] = useState({});
  const [models, setModels] = useState([]);

  useEffect(() => {
    loadSettings();
    loadProviders();
  }, []);

  const loadSettings = async () => {
    const apiSettings = await SettingsManager.loadApiSettings();
    const startupSettings = await SettingsManager.loadStartupSettings();
    const editorSettings = await SettingsManager.loadEditorSettings();
    setSettings({...settings, ...apiSettings, ...startupSettings, ...editorSettings});
  };

  const loadProviders = async () => {
    const aiProvider = await AIProvider.init();
    setProviders(aiProvider.getProviders());
    updateModels(aiProvider, settings.selectedProvider);
  };

  const updateModels = (aiProvider, providerId) => {
    const providerModels = aiProvider.getModels(providerId);
    setModels(providerModels);
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({...prev, [key]: value}));
  };

  const saveSettings = async () => {
    await SettingsManager.saveApiSettings({
      selectedProvider: settings.selectedProvider,
      anthropicApiKey: settings.anthropicApiKey,
      openaiApiKey: settings.openaiApiKey,
      googleApiKey: settings.googleApiKey,
      cohereApiKey: settings.cohereApiKey,
      togetherApiKey: settings.togetherApiKey,
      openrouterApiKey: settings.openrouterApiKey,
      minimaxApiKey: settings.minimaxApiKey,
      selectedModel: settings.selectedModel,
      customEndpoint: settings.customEndpoint,
      enableAI: true,
    });

    await SettingsManager.saveStartupSettings({
      startMode: settings.startMode,
      autoStartCodeServer: settings.autoStartCodeServer,
      restoreSession: settings.restoreSession,
      startInDesktopMode: settings.startInDesktopMode,
    });

    await SettingsManager.saveEditorSettings({
      fontSize: settings.fontSize,
      theme: settings.darkTheme ? 'dark' : 'light',
      wordWrap: settings.wordWrap,
      showLineNumbers: settings.showLineNumbers,
      showMinimap: settings.showMinimap,
      autoComplete: true,
      showWhitespace: false,
    });

    Alert.alert('Settings Saved', 'All settings have been saved successfully');
  };

  const testConnection = async () => {
    const apiKey = settings[`${settings.selectedProvider}ApiKey`];
    if (!apiKey) {
      Alert.alert('Error', 'Please enter an API key first');
      return;
    }

    Alert.alert('Testing', 'Testing connection...\n\nPlease wait...', [{text: 'OK'}]);

    try {
      const result = await providers[settings.selectedProvider]?.testConnection
        ? await providers[settings.selectedProvider].testConnection(settings.selectedProvider, apiKey)
        : await AIProvider.testConnection(settings.selectedProvider, apiKey);

      if (result.success) {
        Alert.alert(
          '✅ Connection Successful',
          `${result.message || result}\n\nProvider: ${result.provider || settings.selectedProvider}\nStatus: ${result.status || 'Active'}`
        );
      } else {
        Alert.alert(
          '❌ Connection Failed',
          result.error || 'Unknown error occurred'
        );
      }
    } catch (error) {
      Alert.alert(
        '❌ Error',
        `Failed to test connection: ${error.message}`
      );
    }
  };

  const tabs = [
    { id: 'api', name: '🤖 AI Providers' },
    { id: 'startup', name: '🚀 Startup' },
    { id: 'editor', name: '📝 Editor' },
    { id: 'display', name: '🖥️ Display' },
  ];

  const renderApiSettings = () => (
    <ScrollView style={styles.section}>
      <Text style={styles.sectionTitle}>AI Providers Configuration</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Select AI Provider</Text>
        <FlatList
          data={Object.values(providers)}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => {
            const providerId = Object.keys(providers).find(k => providers[k] === item);
            return (
              <TouchableOpacity
                style={[
                  styles.providerButton,
                  settings.selectedProvider === providerId && styles.providerButtonActive
                ]}
                onPress={() => {
                  updateSetting('selectedProvider', providerId);
                  updateModels(AIProvider, providerId);
                }}>
                <Text style={styles.providerButtonText}>{item.name}</Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.name}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {providers[settings.selectedProvider]?.name} API Key
        </Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            value={settings[`${settings.selectedProvider}ApiKey`]}
            onChangeText={(text) => updateSetting(`${settings.selectedProvider}ApiKey`, text)}
            placeholder={settings.selectedProvider === 'anthropic' ? 'sk-ant-...' : 'Enter API key'}
            placeholderTextColor="#666"
            secureTextEntry={!showApiKey[settings.selectedProvider]}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.showButton}
            onPress={() => setShowApiKey({...showApiKey, [settings.selectedProvider]: !showApiKey[settings.selectedProvider]})}>
            <Text style={styles.showButtonText}>
              {showApiKey[settings.selectedProvider] ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Model</Text>
        {models.map(model => (
          <TouchableOpacity
            key={model.id}
            style={[
              styles.modelOption,
              settings.selectedModel === model.id && styles.modelOptionActive
            ]}
            onPress={() => updateSetting('selectedModel', model.id)}>
            <Text style={[
              styles.modelName,
              settings.selectedModel === model.id && styles.modelNameActive
            ]}>
              {model.name}
            </Text>
            <Text style={[
              styles.modelDescription,
              settings.selectedModel === model.id && styles.modelDescriptionActive
            ]}>
              {model.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.testButton} onPress={testConnection}>
        <Text style={styles.testButtonText}>🔍 Test Connection</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderStartupSettings = () => (
    <ScrollView style={styles.section}>
      <Text style={styles.sectionTitle}>Startup Behavior</Text>

      {renderToggleRow('Auto-Start Code-Server', 'autoStartCodeServer')}
      {renderToggleRow('Restore Last Session', 'restoreSession')}
      {renderToggleRow('Start in Desktop Mode', 'startInDesktopMode')}
    </ScrollView>
  );

  const renderEditorSettings = () => (
    <ScrollView style={styles.section}>
      <Text style={styles.sectionTitle}>Code Editor</Text>

      {renderToggleRow('Show Line Numbers', 'showLineNumbers')}
      {renderToggleRow('Word Wrap', 'wordWrap')}
      {renderToggleRow('Show Minimap', 'showMinimap')}

      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Font Size</Text>
          <Text style={styles.settingDescription}>{settings.fontSize}px</Text>
        </View>
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
      </View>
    </ScrollView>
  );

  const renderDisplaySettings = () => (
    <ScrollView style={styles.section}>
      <Text style={styles.sectionTitle}>Display</Text>

      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Desktop Mode</Text>
          <Text style={styles.settingDescription}>Toggle between mobile and desktop layout</Text>
        </View>
        <Switch
          value={isDesktopMode}
          onValueChange={onToggleMode}
          trackColor={{false: '#3e3e42', true: '#0e639c'}}
        />
      </View>

      {renderToggleRow('Dark Theme', 'darkTheme')}
    </ScrollView>
  );

  const renderToggleRow = (title, key) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      <Switch
        value={settings[key]}
        onValueChange={(value) => updateSetting(key, value)}
        trackColor={{false: '#3e3e42', true: '#0e639c'}}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <FlatList
          data={tabs}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === item.id && styles.activeTab
              ]}
              onPress={() => setActiveTab(item.id)}>
              <Text style={styles.tabText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      {activeTab === 'api' && renderApiSettings()}
      {activeTab === 'startup' && renderStartupSettings()}
      {activeTab === 'editor' && renderEditorSettings()}
      {activeTab === 'display' && renderDisplaySettings()}

      <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
        <Text style={styles.saveButtonText}>💾 Save All Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  tabBar: {
    backgroundColor: '#2d2d30',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3e3e42',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  activeTab: {
    backgroundColor: '#0e639c',
  },
  tabText: {
    color: '#ffffff',
    fontSize: 13,
  },
  section: {
    backgroundColor: '#252526',
    marginTop: 12,
    padding: 12,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  providerButton: {
    backgroundColor: '#3e3e42',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  providerButtonActive: {
    backgroundColor: '#0e639c',
  },
  providerButtonText: {
    color: '#ffffff',
    fontSize: 12,
  },
  input: {
    backgroundColor: '#3c3c3c',
    color: '#ffffff',
    padding: 12,
    borderRadius: 4,
    fontSize: 14,
    flex: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: '#3c3c3c',
    borderRadius: 4,
  },
  showButton: {
    padding: 12,
  },
  showButtonText: {
    fontSize: 18,
  },
  modelOption: {
    backgroundColor: '#3c3c3c',
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  modelOptionActive: {
    backgroundColor: '#0e639c',
  },
  modelName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  modelNameActive: {
    fontWeight: 'bold',
  },
  modelDescription: {
    color: '#cccccc',
    fontSize: 12,
  },
  modelDescriptionActive: {
    color: '#e0e0e0',
  },
  testButton: {
    backgroundColor: '#0e639c',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  testButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
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
  saveButton: {
    backgroundColor: '#0e639c',
    padding: 16,
    margin: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Settings;
