import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView, Switch, Modal} from 'react-native';

const APIConfig = () => {
  const [apiSettings, setApiSettings] = useState({
    claudeApiKey: '',
    anthropicApiKey: '',
    selectedModel: 'claude-3-sonnet-20240229',
    customEndpoint: '',
    autoSave: true,
    cloudSync: false,
    enableAI: true,
  });

  const [showApiKey, setShowApiKey] = useState({
    claude: false,
    anthropic: false,
  });

  useEffect(() => {
    // Load settings from storage
    loadSettings();
  }, []);

  const loadSettings = async () => {
    // Simulate loading from AsyncStorage
    // In real app: const settings = await AsyncStorage.getItem('apiSettings');
    console.log('Loading API settings...');
  };

  const saveSettings = async () => {
    // Simulate saving to AsyncStorage
    // In real app: await AsyncStorage.setItem('apiSettings', JSON.stringify(apiSettings));
    Alert.alert('Settings Saved', 'API configuration saved successfully');
  };

  const testConnection = () => {
    Alert.alert(
      'Test Connection',
      'Testing API connection...\n\nIn a real implementation, this would verify your API key with Anthropic.',
      [{text: 'OK'}]
    );
  };

  const models = [
    { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet (Recommended)', description: 'Balanced speed and quality' },
    { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: 'Most powerful model' },
    { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', description: 'Fastest model' },
    { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', description: 'Latest Sonnet model' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Claude API Configuration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🤖 Claude AI Configuration</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Configure Claude AI integration for code assistance, auto-completion, and chat.
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Anthropic API Key</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              value={apiSettings.anthropicApiKey}
              onChangeText={(text) => setApiSettings({...apiSettings, anthropicApiKey: text})}
              placeholder="sk-ant-..."
              placeholderTextColor="#666"
              secureTextEntry={!showApiKey.anthropic}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.showButton}
              onPress={() => setShowApiKey({...showApiKey, anthropic: !showApiKey.anthropic})}>
              <Text style={styles.showButtonText}>
                {showApiKey.anthropic ? '👁️' : '👁️‍🗨️'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.hint}>
            Get your API key from: https://console.anthropic.com/
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Model Selection</Text>
          {models.map(model => (
            <TouchableOpacity
              key={model.id}
              style={[
                styles.modelOption,
                apiSettings.selectedModel === model.id && styles.modelOptionActive
              ]}
              onPress={() => setApiSettings({...apiSettings, selectedModel: model.id})}>
              <Text style={[
                styles.modelName,
                apiSettings.selectedModel === model.id && styles.modelNameActive
              ]}>
                {model.name}
              </Text>
              <Text style={[
                styles.modelDescription,
                apiSettings.selectedModel === model.id && styles.modelDescriptionActive
              ]}>
                {model.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Custom Endpoint (Optional)</Text>
          <TextInput
            style={styles.input}
            value={apiSettings.customEndpoint}
            onChangeText={(text) => setApiSettings({...apiSettings, customEndpoint: text})}
            placeholder="https://api.anthropic.com"
            placeholderTextColor="#666"
          />
        </View>

        <TouchableOpacity style={styles.testButton} onPress={testConnection}>
          <Text style={styles.testButtonText}>🔍 Test Connection</Text>
        </TouchableOpacity>
      </View>

      {/* AI Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✨ AI Features</Text>

        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Enable AI Assistant</Text>
            <Text style={styles.toggleDescription}>Get code suggestions and help</Text>
          </View>
          <Switch
            value={apiSettings.enableAI}
            onValueChange={(value) => setApiSettings({...apiSettings, enableAI: value})}
            trackColor={{false: '#3e3e42', true: '#0e639c'}}
            thumbColor={apiSettings.enableAI ? '#ffffff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Auto-Save with AI</Text>
            <Text style={styles.toggleDescription}>Automatically save and get AI feedback</Text>
          </View>
          <Switch
            value={apiSettings.autoSave}
            onValueChange={(value) => setApiSettings({...apiSettings, autoSave: value})}
            trackColor={{false: '#3e3e42', true: '#0e639c'}}
            thumbColor={apiSettings.autoSave ? '#ffffff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Cloud Sync</Text>
            <Text style={styles.toggleDescription}>Sync settings and files across devices</Text>
          </View>
          <Switch
            value={apiSettings.cloudSync}
            onValueChange={(value) => setApiSettings({...apiSettings, cloudSync: value})}
            trackColor={{false: '#3e3e42', true: '#0e639c'}}
            thumbColor={apiSettings.cloudSync ? '#ffffff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
          <Text style={styles.saveButtonText}>💾 Save Configuration</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={() => {
          Alert.alert(
            'Reset Settings',
            'Are you sure you want to reset all settings?',
            [
              {text: 'Cancel', style: 'cancel'},
              {
                text: 'Reset',
                style: 'destructive',
                onPress: () => {
                  setApiSettings({
                    claudeApiKey: '',
                    anthropicApiKey: '',
                    selectedModel: 'claude-3-sonnet-20240229',
                    customEndpoint: '',
                    autoSave: true,
                    cloudSync: false,
                    enableAI: true,
                  });
                }
              }
            ]
          );
        }}>
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
    marginBottom: 12,
  },
  infoBox: {
    backgroundColor: '#2d2d30',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  infoText: {
    color: '#cccccc',
    fontSize: 13,
    lineHeight: 18,
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
  input: {
    backgroundColor: '#3c3c3c',
    color: '#ffffff',
    padding: 12,
    borderRadius: 4,
    fontSize: 14,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3c3c3c',
    borderRadius: 4,
  },
  showButton: {
    padding: 12,
  },
  showButtonText: {
    fontSize: 18,
  },
  hint: {
    color: '#999999',
    fontSize: 11,
    marginTop: 4,
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
  saveButton: {
    backgroundColor: '#0e639c',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#3e3e42',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
});

export default APIConfig;
