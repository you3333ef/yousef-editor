import React, {useState, useRef, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, WebView, Alert, TextInput, Modal} from 'react-native';
import {TABS} from './TabManager';

const CodeEditor = ({isDesktopMode}) => {
  const [codeServerUrl, setCodeServerUrl] = useState('http://localhost:8080');
  const [isCodeServerRunning, setIsCodeServerRunning] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const webViewRef = useRef(null);

  useEffect(() => {
    // Simulate code-server check
    setTimeout(() => setIsCodeServerRunning(true), 2000);
  }, []);

  const startCodeServer = async () => {
    // In a real implementation, this would start code-server
    Alert.alert(
      'Code-Server',
      'Starting code-server...\n\nIn a real app, this would:\n• Install code-server binary\n• Start server on port 8080\n• Configure workspace directory',
      [
        {
          text: 'OK',
          onPress: () => setIsCodeServerRunning(true),
        },
      ],
    );
  };

  const stopCodeServer = () => {
    Alert.alert(
      'Code-Server',
      'Stopping code-server...',
      [{text: 'OK', onPress: () => setIsCodeServerRunning(false)}],
    );
  };

  const renderMobileView = () => (
    <View style={styles.mobileContainer}>
      <View style={styles.mobileHeader}>
        <Text style={styles.mobileTitle}>VS Code Browser</Text>
        <View style={styles.mobileControls}>
          {!isCodeServerRunning ? (
            <TouchableOpacity style={styles.startButton} onPress={startCodeServer}>
              <Text style={styles.startButtonText}>🚀 Start</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.stopButton} onPress={stopCodeServer}>
              <Text style={styles.stopButtonText}>⏹ Stop</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.urlButton}
            onPress={() => setShowUrlInput(true)}>
            <Text style={styles.urlButtonText}>🔗 URL</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isCodeServerRunning ? (
        <WebView
          ref={webViewRef}
          source={{uri: codeServerUrl}}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          onError={(syntheticEvent) => {
            const {nativeEvent} = syntheticEvent;
            Alert.alert('WebView Error', nativeEvent.description);
          }}
        />
      ) : (
        <View style={styles.notStartedView}>
          <Text style={styles.notStartedText}>Code-Server is not running</Text>
          <Text style={styles.notStartedSubtext}>
            Tap "Start" to launch VS Code in browser
          </Text>
          <TouchableOpacity style={styles.startButtonLarge} onPress={startCodeServer}>
            <Text style={styles.startButtonText}>🚀 Start Code-Server</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderDesktopView = () => (
    <View style={styles.desktopContainer}>
      {/* Desktop Mode has panels */}
      <View style={styles.desktopPanels}>
        {/* Side Panel - File Explorer */}
        <View style={styles.sidePanel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>EXPLORER</Text>
          </View>
          <View style={styles.fileList}>
            <Text style={styles.fileItem}>📁 my-project</Text>
            <Text style={styles.fileItem}>📄 README.md</Text>
            <Text style={styles.fileItem}>📄 package.json</Text>
            <Text style={styles.fileItem}>📄 App.js</Text>
            <Text style={styles.fileItem}>📄 index.js</Text>
          </View>
        </View>

        {/* Main Editor Area */}
        <View style={styles.mainPanel}>
          <View style={styles.editorHeader}>
            <Text style={styles.editorTitle}>App.js - Yousef Editor</Text>
            <View style={styles.editorControls}>
              <TouchableOpacity style={styles.smallButton}>
                <Text style={styles.smallButtonText}>○</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallButton}>
                <Text style={styles.smallButtonText}>━</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallButton}>
                <Text style={styles.smallButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          </View>

          {isCodeServerRunning ? (
            <WebView
              ref={webViewRef}
              source={{uri: codeServerUrl}}
              style={styles.desktopWebview}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={false}
              allowFileAccess={true}
              allowUniversalAccessFromFileURLs={true}
            />
          ) : (
            <View style={styles.desktopNotStarted}>
              <Text style={styles.desktopNotStartedText}>VS Code Interface</Text>
              <Text style={styles.desktopNotStartedSubtext}>Code-Server not running</Text>
              <TouchableOpacity style={styles.startButtonLarge} onPress={startCodeServer}>
                <Text style={styles.startButtonText}>🚀 Start Code-Server</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Right Panel - Terminal */}
        <View style={styles.rightPanel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>TERMINAL</Text>
          </View>
          <View style={styles.terminalContent}>
            <Text style={styles.terminalText}>$ npm start</Text>
            <Text style={styles.terminalText}>Starting Metro bundler...</Text>
            <Text style={styles.terminalText}>$ _</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <>
      {isDesktopMode ? renderDesktopView() : renderMobileView()}

      {/* URL Input Modal */}
      <Modal
        visible={showUrlInput}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUrlInput(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Code-Server URL</Text>
            <TextInput
              style={styles.urlInput}
              value={codeServerUrl}
              onChangeText={setCodeServerUrl}
              placeholder="http://localhost:8080"
              placeholderTextColor="#666"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowUrlInput(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => {
                  setShowUrlInput(false);
                  setIsCodeServerRunning(true);
                }}>
                <Text style={styles.modalButtonText}>Connect</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  mobileContainer: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#2d2d30',
    borderBottomWidth: 1,
    borderBottomColor: '#3e3e42',
  },
  mobileTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mobileControls: {
    flexDirection: 'row',
    gap: 8,
  },
  startButton: {
    backgroundColor: '#0e639c',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  startButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  stopButton: {
    backgroundColor: '#c50e1f',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  stopButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  urlButton: {
    backgroundColor: '#3e3e42',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  urlButtonText: {
    color: '#ffffff',
  },
  webview: {
    flex: 1,
  },
  notStartedView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notStartedText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  notStartedSubtext: {
    color: '#cccccc',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  startButtonLarge: {
    backgroundColor: '#0e639c',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  desktopContainer: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  desktopPanels: {
    flex: 1,
    flexDirection: 'row',
  },
  sidePanel: {
    width: 250,
    backgroundColor: '#252526',
    borderRightWidth: 1,
    borderRightColor: '#3e3e42',
  },
  mainPanel: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  rightPanel: {
    width: 300,
    backgroundColor: '#252526',
    borderLeftWidth: 1,
    borderLeftColor: '#3e3e42',
  },
  panelHeader: {
    padding: 8,
    backgroundColor: '#2d2d30',
    borderBottomWidth: 1,
    borderBottomColor: '#3e3e42',
  },
  panelTitle: {
    color: '#cccccc',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  fileList: {
    padding: 8,
  },
  fileItem: {
    color: '#cccccc',
    padding: 4,
    fontSize: 13,
  },
  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#2d2d30',
    borderBottomWidth: 1,
    borderBottomColor: '#3e3e42',
  },
  editorTitle: {
    color: '#ffffff',
    fontSize: 13,
  },
  editorControls: {
    flexDirection: 'row',
    gap: 4,
  },
  smallButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallButtonText: {
    color: '#cccccc',
    fontSize: 12,
  },
  desktopWebview: {
    flex: 1,
  },
  desktopNotStarted: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  desktopNotStartedText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  desktopNotStartedSubtext: {
    color: '#cccccc',
    fontSize: 14,
    marginBottom: 20,
  },
  terminalContent: {
    flex: 1,
    padding: 8,
  },
  terminalText: {
    color: '#0f0',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2d2d30',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  urlInput: {
    backgroundColor: '#3c3c3c',
    color: '#ffffff',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  cancelButton: {
    backgroundColor: '#3e3e42',
  },
  saveButton: {
    backgroundColor: '#0e639c',
  },
  modalButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default CodeEditor;
