import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, TextInput} from 'react-native';

const FileExplorer = () => {
  const [currentPath, setCurrentPath] = useState('/storage/emulated/0/yousef-editor');
  const [files, setFiles] = useState([
    { name: 'src', type: 'folder', size: 4096 },
    { name: 'assets', type: 'folder', size: 4096 },
    { name: 'package.json', type: 'file', size: 1024 },
    { name: 'README.md', type: 'file', size: 512 },
    { name: 'App.js', type: 'file', size: 2048 },
    { name: 'index.js', type: 'file', size: 256 },
  ]);
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  const navigateToFolder = (folderName) => {
    setCurrentPath(`${currentPath}/${folderName}`);
    // Simulate loading files
    setFiles([
      { name: '..', type: 'up', size: 0 },
      { name: 'components', type: 'folder', size: 4096 },
      { name: 'utils', type: 'folder', size: 4096 },
      { name: 'TabManager.js', type: 'file', size: 1024 },
      { name: 'CodeEditor.js', type: 'file', size: 2048 },
    ]);
  };

  const goUp = () => {
    const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
    setCurrentPath(parentPath === '' ? '/' : parentPath);
  };

  const createNewFile = () => {
    if (!newFileName.trim()) {
      Alert.alert('Error', 'Please enter a file name');
      return;
    }

    const newFile = {
      name: newFileName,
      type: newFileName.includes('.') ? 'file' : 'folder',
      size: 0,
    };

    setFiles([...files, newFile]);
    setNewFileName('');
    setShowNewFileDialog(false);
    Alert.alert('Success', `${newFileName} created successfully`);
  };

  const deleteFile = (fileName) => {
    Alert.alert(
      'Delete File',
      `Are you sure you want to delete ${fileName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setFiles(files.filter(f => f.name !== fileName));
          },
        },
      ]
    );
  };

  const renameFile = (oldName) => {
    Alert.prompt(
      'Rename',
      'Enter new name:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Rename',
          onPress: (newName) => {
            if (newName && newName.trim()) {
              setFiles(files.map(f =>
                f.name === oldName ? { ...f, name: newName.trim() } : f
              ));
            }
          },
        },
      ],
      'plain-text',
      oldName
    );
  };

  const renderFileItem = ({ item }) => {
    const getIcon = () => {
      if (item.type === 'folder') return '📁';
      if (item.type === 'file') return '📄';
      if (item.type === 'up') return '⬆️';
      return '📄';
    };

    return (
      <TouchableOpacity
        style={styles.fileItem}
        onPress={() => {
          if (item.type === 'folder') {
            navigateToFolder(item.name);
          }
        }}
        onLongPress={() => {
          Alert.alert(
            item.name,
            'Choose action:',
            [
              { text: 'Rename', onPress: () => renameFile(item.name) },
              { text: 'Delete', style: 'destructive', onPress: () => deleteFile(item.name) },
              { text: 'Cancel', style: 'cancel' },
            ]
          );
        }}>
        <Text style={styles.fileIcon}>{getIcon()}</Text>
        <View style={styles.fileInfo}>
          <Text style={styles.fileName} numberOfLines={1}>
            {item.name}
          </Text>
          {item.type === 'file' && (
            <Text style={styles.fileSize}>
              {item.size > 1024 ? `${(item.size / 1024).toFixed(1)}KB` : `${item.size}B`}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>File Explorer</Text>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => setShowNewFileDialog(true)}>
          <Text style={styles.newButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>

      {/* Breadcrumb */}
      <View style={styles.breadcrumb}>
        <Text style={styles.pathText} numberOfLines={1}>
          {currentPath}
        </Text>
      </View>

      {/* File List */}
      <FlatList
        data={files}
        renderItem={renderFileItem}
        keyExtractor={(item) => item.name}
        style={styles.fileList}
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Text style={styles.emptyText}>This folder is empty</Text>
          </View>
        }
      />

      {/* Storage Info */}
      <View style={styles.storageInfo}>
        <Text style={styles.storageText}>
          📱 Internal Storage: 2.5GB / 32GB available
        </Text>
      </View>

      {/* New File Dialog */}
      {showNewFileDialog && (
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogContent}>
            <Text style={styles.dialogTitle}>Create New</Text>
            <TextInput
              style={styles.dialogInput}
              placeholder="File or folder name"
              placeholderTextColor="#999"
              value={newFileName}
              onChangeText={setNewFileName}
            />
            <View style={styles.dialogButtons}>
              <TouchableOpacity
                style={[styles.dialogButton, styles.cancelDialogButton]}
                onPress={() => {
                  setShowNewFileDialog(false);
                  setNewFileName('');
                }}>
                <Text style={styles.dialogButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dialogButton, styles.createDialogButton]}
                onPress={createNewFile}>
                <Text style={styles.dialogButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#2d2d30',
    borderBottomWidth: 1,
    borderBottomColor: '#3e3e42',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  newButton: {
    backgroundColor: '#0e639c',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  newButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  breadcrumb: {
    padding: 8,
    backgroundColor: '#252526',
    borderBottomWidth: 1,
    borderBottomColor: '#3e3e42',
  },
  pathText: {
    color: '#cccccc',
    fontSize: 12,
  },
  fileList: {
    flex: 1,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d30',
  },
  fileIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 2,
  },
  fileSize: {
    color: '#999999',
    fontSize: 11,
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999999',
    fontSize: 16,
  },
  storageInfo: {
    padding: 8,
    backgroundColor: '#252526',
    borderTopWidth: 1,
    borderTopColor: '#3e3e42',
  },
  storageText: {
    color: '#cccccc',
    fontSize: 12,
  },
  dialogOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContent: {
    backgroundColor: '#2d2d30',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  dialogTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dialogInput: {
    backgroundColor: '#3c3c3c',
    color: '#ffffff',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  dialogButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  dialogButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  cancelDialogButton: {
    backgroundColor: '#3e3e42',
  },
  createDialogButton: {
    backgroundColor: '#0e639c',
  },
  dialogButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default FileExplorer;
