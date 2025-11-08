import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';

const VHEditorFeatures = () => {
  const coreFeatures = [
    { icon: '⚡', title: 'Code-Server Integration', desc: 'Full VS Code in browser' },
    { icon: '🤖', title: 'AI Assistant (8 Providers)', desc: 'Claude, OpenAI, Gemini, Cohere, Together, Ollama, OpenRouter, MiniMax' },
    { icon: '💻', title: 'Terminal Emulator', desc: 'Full terminal with command history' },
    { icon: '📁', title: 'File Explorer', desc: 'Browse, create, edit, delete files' },
    { icon: '🗂️', title: 'Project Manager', desc: 'Create and manage projects' },
    { icon: '🔧', title: 'Settings Panel', desc: 'Comprehensive configuration' },
  ];

  const aiProviders = [
    { name: 'Anthropic Claude', models: '4 models', status: '✅' },
    { name: 'OpenAI', models: '4 models', status: '✅' },
    { name: 'Google Gemini', models: '3 models', status: '✅' },
    { name: 'Cohere', models: '3 models', status: '✅' },
    { name: 'Together AI', models: '4 models', status: '✅' },
    { name: 'Ollama (Local)', models: '4 models', status: '✅' },
    { name: 'OpenRouter', models: '6 models', status: '✅' },
    { name: 'MiniMax AI', models: '6 models', status: '✅' },
  ];

  const advancedFeatures = [
    { icon: '💾', title: 'Auto-Save', desc: 'Automatic file saving with intervals' },
    { icon: '☁️', title: 'Cloud Sync', desc: 'Backup and sync settings' },
    { icon: '📱', title: 'Dual Mode', desc: 'Mobile & Desktop layouts' },
    { icon: '🗂️', title: 'Multi-Tab', desc: '8 tabs for multitasking' },
    { icon: '🔄', title: 'Session Restore', desc: 'Resume where you left off' },
    { icon: '🌙', title: 'Dark Theme', desc: 'Built-in dark/light themes' },
    { icon: '🔍', title: 'File Search', desc: 'Search across all files' },
    { icon: '📊', title: 'Project History', desc: '50 version history' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚀 Yousef Editor</Text>
        <Text style={styles.headerSubtitle}>
          Android Code Editor with AI Integration
        </Text>
        <Text style={styles.headerDescription}>
          Complete VHEditor functionality with 8 AI providers
        </Text>
      </View>

      {/* Core Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Core Features</Text>
        <View style={styles.featuresGrid}>
          {coreFeatures.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* AI Providers */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🤖 AI Providers (8 Total)</Text>
        <Text style={styles.sectionSubtitle}>
          Configure multiple AI providers and switch between them instantly
        </Text>
        {aiProviders.map((provider, index) => (
          <View key={index} style={styles.providerRow}>
            <Text style={styles.providerStatus}>{provider.status}</Text>
            <Text style={styles.providerName}>{provider.name}</Text>
            <Text style={styles.providerModels}>{provider.models}</Text>
          </View>
        ))}
      </View>

      {/* Advanced Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✨ Advanced Features</Text>
        <View style={styles.featuresGrid}>
          {advancedFeatures.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* VHEditor Parity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✅ VHEditor Parity</Text>
        <Text style={styles.parityText}>
          ✓ Code-server powered VS Code{'\n'}
          ✓ Termux integration{'\n'}
          ✓ Full file system access{'\n'}
          ✓ Terminal commands{'\n'}
          ✓ Project management{'\n'}
          ✓ Git support{'\n'}
          ✓ Extension support{'\n'}
          ✓ Multi-language support{'\n'}
          ✓ AI-powered coding assistance{'\n'}
          ✓ 8 AI providers (vs VHEditor's 1){'\n'}
          ✓ Auto-start configuration{'\n'}
          ✓ Mobile-optimized UI{'\n'}
          ✓ Session management{'\n'}
          ✓ Cloud sync{'\n'}
          ✓ Settings persistence
        </Text>
      </View>

      {/* Quick Start */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚀 Quick Start</Text>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>1</Text>
          <Text style={styles.stepText}>Open Settings tab</Text>
        </View>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>2</Text>
          <Text style={styles.stepText}>Configure AI provider API key</Text>
        </View>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>3</Text>
          <Text style={styles.stepText}>Test connection</Text>
        </View>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>4</Text>
          <Text style={styles.stepText}>Start coding with AI assistance!</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>AI Providers</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>34+</Text>
          <Text style={styles.statLabel}>Models</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Tabs</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>50</Text>
          <Text style={styles.statLabel}>File History</Text>
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
  header: {
    backgroundColor: '#0e639c',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 4,
  },
  headerDescription: {
    color: '#e0e0e0',
    fontSize: 14,
  },
  section: {
    backgroundColor: '#252526',
    margin: 12,
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionSubtitle: {
    color: '#999999',
    fontSize: 13,
    marginBottom: 12,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    backgroundColor: '#2d2d30',
    padding: 12,
    borderRadius: 6,
    width: '47%',
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDesc: {
    color: '#999999',
    fontSize: 11,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d30',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  providerStatus: {
    fontSize: 18,
    marginRight: 12,
  },
  providerName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  providerModels: {
    color: '#0e639c',
    fontSize: 12,
    fontWeight: 'bold',
  },
  parityText: {
    color: '#cccccc',
    fontSize: 14,
    lineHeight: 24,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    backgroundColor: '#0e639c',
    color: '#ffffff',
    width: 28,
    height: 28,
    borderRadius: 14,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
    marginRight: 12,
  },
  stepText: {
    color: '#ffffff',
    fontSize: 14,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 12,
  },
  statBox: {
    backgroundColor: '#0e639c',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    margin: 4,
  },
  statNumber: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#e0e0e0',
    fontSize: 12,
    marginTop: 4,
  },
});

export default VHEditorFeatures;
