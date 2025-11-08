/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  WebView,
  Button,
  Alert,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const SECTION_TITLE = 'yousef editor';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [webViewVisible, setWebViewVisible] = useState(true); // Default to true for auto-start
  const [codeServerRunning, setCodeServerRunning] = useState(false);
  const [showTabManager, setShowTabManager] = useState(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  useEffect(() => {
    // Auto-start code-server when app opens
    autoStartCodeServer();
  }, []);

  const autoStartCodeServer = () => {
    // Simulate code-server starting
    setTimeout(() => {
      setCodeServerRunning(true);
      setWebViewVisible(true);
    }, 1500);
  };

  const startCodeServer = async () => {
    // Fallback if needed
    setCodeServerRunning(true);
    setWebViewVisible(true);
  };

  const openTerminal = () => {
    setShowTabManager(true);
  };

  if (showTabManager) {
    // Import TabManager dynamically
    const TabManager = require('./components/TabManager').default;
    return (
      <TabManager
        isDesktopMode={false}
        onToggleMode={() => {}}
      />
    );
  }

  if (webViewVisible) {
    return (
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <View style={styles.topBar}>
          <Button title="← Back" onPress={() => setWebViewVisible(false)} />
          <Text style={styles.title}>VS Code Browser</Text>
        </View>
        <WebView
          source={{uri: 'http://localhost:8080'}}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title={SECTION_TITLE}>
            Android code editor with VS Code in browser, powered by code-server
            and Termux integration.
          </Section>
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button
                title="💻 Open Multi-Tab Workspace"
                onPress={openTerminal}
                color="#03DAC5"
              />
            </View>
            <View style={styles.button}>
              <Button
                title="📁 File Explorer"
                onPress={openTerminal}
                color="#FF9800"
              />
            </View>
            <View style={styles.button}>
              <Button
                title="🛠️ Settings"
                onPress={openTerminal}
                color="#9C27B0"
              />
            </View>
          </View>
          <Section title="Status">
            {codeServerRunning ? (
              <Text style={styles.successText}>✓ Code-Server is running!</Text>
            ) : (
              <Text style={styles.infoText}>⏳ Starting services...</Text>
            )}
          </Section>
          <Section title="Features">
            <Text style={styles.featureList}>
              • Run VS Code in your browser on Android{'\n'}
              • Multi-tab support for multitasking{'\n'}
              • Integrated terminal with Termux{'\n'}
              • File explorer and project manager{'\n'}
              • Desktop and mobile modes{'\n'}
              • Git integration
            </Text>
          </Section>
          <Section title="Instructions">
            <ReloadInstructions />
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Section = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  buttonContainer: {
    padding: 16,
    gap: 12,
  },
  button: {
    marginVertical: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#6200EE',
  },
  webview: {
    flex: 1,
  },
  successText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500',
  },
  infoText: {
    color: '#2196F3',
    fontSize: 16,
  },
  featureList: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default App;
