import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, KeyboardAvoidingView, Platform} from 'react-native';

const Terminal = () => {
  const [commands, setCommands] = useState([
    { id: '1', type: 'output', text: 'Welcome to Yousef Editor Terminal v1.0' },
    { id: '2', type: 'output', text: 'Type "help" for available commands' },
    { id: '3', type: 'output', text: '---------------------------------------' },
    { id: '4', type: 'output', text: '$ ' },
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const flatListRef = useRef(null);

  useEffect(() => {
    // Auto scroll to bottom
    flatListRef.current?.scrollToEnd({animated: true});
  }, [commands]);

  const executeCommand = (cmd) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    // Add command to history
    setCommandHistory([...commandHistory, trimmedCmd]);
    setHistoryIndex(-1);

    // Add command to terminal
    const newCommands = [
      ...commands,
      { id: Date.now().toString(), type: 'command', text: `$ ${trimmedCmd}` }
    ];

    // Process command
    let output = '';
    switch (trimmedCmd.toLowerCase()) {
      case 'help':
        output = `
Available commands:
  help           - Show this help message
  clear          - Clear terminal
  pwd            - Print working directory
  ls             - List files
  cat <file>     - Show file contents
  mkdir <dir>    - Create directory
  nano <file>    - Edit file
  npm start      - Start React Native Metro
  gradle build   - Build Android project
  git status     - Show git status
  version        - Show app version
  info           - Show system info
        `.trim();
        break;

      case 'clear':
        setCommands([]);
        setCurrentCommand('');
        return;

      case 'pwd':
        output = '/storage/emulated/0/yousef-editor';
        break;

      case 'ls':
        output = `total 12
drwxr-xr-x    3 yousef yousef    4096 Nov  8 10:30 .
drwxr-xr-x    1 yousef yousef    4096 Nov  8 10:30 ..
-rw-r--r--    1 yousef yousef    1024 Nov  8 10:30 package.json
-rw-r--r--    1 yousef yousef     512 Nov  8 10:30 README.md
-rw-r--r--    1 yousef yousef    2048 Nov  8 10:30 App.js
-rw-r--r--    1 yousef yousef     256 Nov  8 10:30 index.js`;
        break;

      case 'npm start':
        output = `> yousef-editor@1.0.0 start
> react-native start

Scanning folders for symlinks...
Metro Bundler started.

To reload the app, press "r"
To open developer menu, press "d"
To open DevTools, press "j"

Loading dependency graph, done.`;
        break;

      case 'gradle build':
        output = `:app:assembleRelease

BUILD SUCCESSFUL in 45s`;
        break;

      case 'git status':
        output = `On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
        modified:   components/CodeEditor.js
        modified:   components/Terminal.js

no changes added to commit`;
        break;

      case 'version':
        output = `Yousef Editor v1.0.0
React Native 0.72.0
Node.js v18.16.0
Android SDK 34`;
        break;

      case 'info':
        output = `System Information:
  Platform: ${Platform.OS}
  Device: Android Emulator
  Android Version: 14 (API 34)
  RAM: 4GB
  Storage: 32GB
  CPU: ARM64
  Java: OpenJDK 17`;
        break;

      case 'cat package.json':
        output = `{
  "name": "yousef-editor",
  "version": "1.0.0",
  "description": "Android code editor with code-server",
  "main": "index.js"
}`;
        break;

      case 'mkdir test':
        output = 'Directory created: test';
        break;

      case 'nano App.js':
        output = 'Opening App.js in nano editor...\n(Editor would open in a real implementation)';
        break;

      default:
        if (trimmedCmd.startsWith('cat ')) {
          const fileName = trimmedCmd.substring(4);
          output = `Displaying ${fileName}...\n\n// File content would be shown here`;
        } else if (trimmedCmd.startsWith('mkdir ')) {
          const dirName = trimmedCmd.substring(6);
          output = `mkdir: cannot create directory '${dirName}': Permission denied`;
        } else {
          output = `bash: ${trimmedCmd}: command not found`;
        }
    }

    // Add output to terminal
    newCommands.push({ id: (Date.now() + 1).toString(), type: 'output', text: output });
    newCommands.push({ id: (Date.now() + 2).toString(), type: 'output', text: '$ ' });

    setCommands(newCommands);
    setCurrentCommand('');
  };

  const handleSubmit = () => {
    executeCommand(currentCommand);
  };

  const handleKeyPress = ({nativeEvent}) => {
    if (nativeEvent.key === 'Enter') {
      handleSubmit();
    }
  };

  const navigateHistory = (direction) => {
    if (direction === 'up' && historyIndex < commandHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
    } else if (direction === 'down' && historyIndex >= 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentCommand(
        newIndex >= 0 ? commandHistory[commandHistory.length - 1 - newIndex] : ''
      );
    }
  };

  const renderItem = ({item}) => {
    const getTextStyle = () => {
      switch (item.type) {
        case 'command':
          return styles.commandText;
        case 'output':
          return styles.outputText;
        default:
          return styles.outputText;
      }
    };

    return (
      <View style={styles.terminalLine}>
        <Text style={getTextStyle()}>{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Terminal Header */}
      <View style={styles.terminalHeader}>
        <Text style={styles.terminalTitle}>Terminal</Text>
        <View style={styles.terminalButtons}>
          <View style={styles.terminalButtonRed} />
          <View style={styles.terminalButtonYellow} />
          <View style={styles.terminalButtonGreen} />
        </View>
      </View>

      {/* Terminal Content */}
      <FlatList
        ref={flatListRef}
        data={commands}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.terminalList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({animated: true})}
      />

      {/* Input Line */}
      <View style={styles.inputContainer}>
        <Text style={styles.prompt}>$ </Text>
        <TextInput
          style={styles.input}
          value={currentCommand}
          onChangeText={setCurrentCommand}
          onSubmitEditing={handleSubmit}
          placeholder="Enter command..."
          placeholderTextColor="#666"
          onKeyPress={handleKeyPress}
        />
      </View>

      {/* Quick Commands */}
      <View style={styles.quickCommands}>
        <Text style={styles.quickCommandsText}>Quick commands: </Text>
        <TouchableOpacity
          style={styles.quickCommandButton}
          onPress={() => setCurrentCommand('help')}>
          <Text style={styles.quickCommandText}>help</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickCommandButton}
          onPress={() => setCurrentCommand('ls')}>
          <Text style={styles.quickCommandText}>ls</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickCommandButton}
          onPress={() => setCurrentCommand('npm start')}>
          <Text style={styles.quickCommandText}>npm start</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  terminalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#2d2d30',
    borderBottomWidth: 1,
    borderBottomColor: '#3e3e42',
  },
  terminalTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  terminalButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  terminalButtonRed: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff5f56',
  },
  terminalButtonYellow: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ffbd2e',
  },
  terminalButtonGreen: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#27c93f',
  },
  terminalList: {
    flex: 1,
    padding: 8,
  },
  terminalLine: {
    marginBottom: 2,
  },
  commandText: {
    color: '#4ec9b0',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
  },
  outputText: {
    color: '#d4d4d4',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#2d2d30',
    borderTopWidth: 1,
    borderTopColor: '#3e3e42',
  },
  prompt: {
    color: '#4ec9b0',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    padding: 4,
  },
  quickCommands: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#252526',
    borderTopWidth: 1,
    borderTopColor: '#3e3e42',
  },
  quickCommandsText: {
    color: '#999999',
    fontSize: 10,
    marginRight: 8,
  },
  quickCommandButton: {
    backgroundColor: '#3e3e42',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
    marginRight: 4,
  },
  quickCommandText: {
    color: '#cccccc',
    fontSize: 10,
  },
});

export default Terminal;
