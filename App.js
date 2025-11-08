/**
 * Yousef Editor - Android Code Editor with AI Integration
 * https://github.com/yousef/yousef-editor
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import TabManager from './components/TabManager';
import SettingsManager from './utils/SettingsManager';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isDesktopMode, setIsDesktopMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Load settings
      const startupSettings = await SettingsManager.loadStartupSettings();
      const editorSettings = await SettingsManager.loadEditorSettings();

      // Set desktop mode based on settings
      setIsDesktopMode(startupSettings.startInDesktopMode || false);

      // Auto-start code-server if configured
      if (startupSettings.autoStartCodeServer) {
        console.log('Auto-starting code-server...');
      }

      // Restore session if enabled
      if (startupSettings.restoreSession) {
        const lastSession = await SettingsManager.loadLastSession();
        if (lastSession) {
          console.log('Restoring last session...');
        }
      }

      // Enable auto-save if configured
      if (startupSettings.autoSave) {
        const interval = editorSettings.autoSaveInterval || 30000;
        await SettingsManager.enableAutoSave(interval);
        console.log(`Auto-save enabled (interval: ${interval}ms)`);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing app:', error);
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsDesktopMode(!isDesktopMode);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Initializing Yousef Editor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <TabManager
        isDesktopMode={isDesktopMode}
        onToggleMode={toggleMode}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default App;
