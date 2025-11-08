import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, TextInput, Modal} from 'react-native';

const ProjectManager = ({onOpenProject}) => {
  const [projects, setProjects] = useState([
    {
      id: '1',
      name: 'yousef-editor',
      path: '/storage/emulated/0/yousef-editor',
      type: 'React Native',
      lastModified: '2024-11-08',
      size: '2.5 MB',
      files: 24,
    },
    {
      id: '2',
      name: 'my-website',
      path: '/storage/emulated/0/projects/my-website',
      type: 'Web App',
      lastModified: '2024-11-07',
      size: '5.2 MB',
      files: 48,
    },
    {
      id: '3',
      name: 'android-app',
      path: '/storage/emulated/0/projects/android-app',
      type: 'Android',
      lastModified: '2024-11-05',
      size: '12.8 MB',
      files: 86,
    },
  ]);

  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectType, setNewProjectType] = useState('React Native');

  const projectTypes = [
    'React Native',
    'React',
    'Android',
    'Flutter',
    'Web App',
    'Node.js',
    'Python',
    'Java',
    'Empty Project',
  ];

  const createNewProject = () => {
    if (!newProjectName.trim()) {
      Alert.alert('Error', 'Please enter a project name');
      return;
    }

    const newProject = {
      id: Date.now().toString(),
      name: newProjectName,
      path: `/storage/emulated/0/projects/${newProjectName}`,
      type: newProjectType,
      lastModified: new Date().toISOString().split('T')[0],
      size: '0 MB',
      files: 0,
    };

    setProjects([newProject, ...projects]);
    setNewProjectName('');
    setNewProjectType('React Native');
    setShowNewProjectDialog(false);
    Alert.alert('Success', `${newProjectName} created successfully`);
  };

  const openProject = (project) => {
    Alert.alert(
      'Open Project',
      `Open "${project.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open',
          onPress: () => {
            // In a real app, this would navigate to the project
            onOpenProject('code-editor');
            Alert.alert('Project Opened', `Opened ${project.name}`);
          },
        },
      ]
    );
  };

  const deleteProject = (projectId, projectName) => {
    Alert.alert(
      'Delete Project',
      `Are you sure you want to delete "${projectName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setProjects(projects.filter(p => p.id !== projectId));
          },
        },
      ]
    );
  };

  const duplicateProject = (project) => {
    const duplicatedProject = {
      ...project,
      id: Date.now().toString(),
      name: `${project.name}-copy`,
      lastModified: new Date().toISOString().split('T')[0],
    };
    setProjects([duplicatedProject, ...projects]);
    Alert.alert('Project Duplicated', `${duplicatedProject.name} created`);
  };

  const renderProjectItem = ({item}) => {
    const getTypeIcon = (type) => {
      switch (type) {
        case 'React Native':
          return '⚛️';
        case 'React':
          return '⚛️';
        case 'Android':
          return '🤖';
        case 'Flutter':
          return '🦋';
        case 'Web App':
          return '🌐';
        case 'Node.js':
          return '🟢';
        case 'Python':
          return '🐍';
        case 'Java':
          return '☕';
        default:
          return '📁';
      }
    };

    return (
      <View style={styles.projectCard}>
        <TouchableOpacity
          style={styles.projectInfo}
          onPress={() => openProject(item)}
          onLongPress={() => {
            Alert.alert(
              item.name,
              'Choose action:',
              [
                { text: 'Open', onPress: () => openProject(item) },
                { text: 'Duplicate', onPress: () => duplicateProject(item) },
                { text: 'Delete', style: 'destructive', onPress: () => deleteProject(item.id, item.name) },
                { text: 'Cancel', style: 'cancel' },
              ]
            );
          }}>
          <View style={styles.projectHeader}>
            <Text style={styles.projectIcon}>{getTypeIcon(item.type)}</Text>
            <View style={styles.projectMeta}>
              <Text style={styles.projectName}>{item.name}</Text>
              <Text style={styles.projectType}>{item.type}</Text>
            </View>
          </View>
          <View style={styles.projectDetails}>
            <Text style={styles.projectPath} numberOfLines={1}>
              📁 {item.path}
            </Text>
            <View style={styles.projectStats}>
              <Text style={styles.projectStat}>📅 {item.lastModified}</Text>
              <Text style={styles.projectStat}>💾 {item.size}</Text>
              <Text style={styles.projectStat}>📄 {item.files} files</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Projects</Text>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => setShowNewProjectDialog(true)}>
          <Text style={styles.newButtonText}>+ New Project</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{projects.length}</Text>
          <Text style={styles.statLabel}>Projects</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {projects.reduce((sum, p) => sum + p.files, 0)}
          </Text>
          <Text style={styles.statLabel}>Total Files</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {Math.round(
              projects.reduce((sum, p) => sum + parseFloat(p.size), 0)
            )}
            MB
          </Text>
          <Text style={styles.statLabel}>Total Size</Text>
        </View>
      </View>

      {/* Projects List */}
      <FlatList
        data={projects}
        renderItem={renderProjectItem}
        keyExtractor={item => item.id}
        style={styles.projectList}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Text style={styles.emptyText}>No projects yet</Text>
            <Text style={styles.emptySubtext}>Create a new project to get started</Text>
          </View>
        }
      />

      {/* New Project Dialog */}
      <Modal
        visible={showNewProjectDialog}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowNewProjectDialog(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Project</Text>

            <Text style={styles.inputLabel}>Project Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter project name"
              placeholderTextColor="#999"
              value={newProjectName}
              onChangeText={setNewProjectName}
            />

            <Text style={styles.inputLabel}>Project Type</Text>
            <View style={styles.typeSelector}>
              <FlatList
                data={projectTypes}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      newProjectType === item && styles.typeButtonActive
                    ]}
                    onPress={() => setNewProjectType(item)}>
                    <Text
                      style={[
                        styles.typeButtonText,
                        newProjectType === item && styles.typeButtonTextActive
                      ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => {
                  setShowNewProjectDialog(false);
                  setNewProjectName('');
                  setNewProjectType('React Native');
                }}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createModalButton]}
                onPress={createNewProject}>
                <Text style={styles.modalButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  newButton: {
    backgroundColor: '#0e639c',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  newButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#252526',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3e3e42',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: '#0e639c',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#cccccc',
    fontSize: 11,
    marginTop: 2,
  },
  projectList: {
    flex: 1,
  },
  listContent: {
    padding: 12,
  },
  projectCard: {
    backgroundColor: '#252526',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#3e3e42',
  },
  projectInfo: {
    padding: 12,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  projectMeta: {
    flex: 1,
  },
  projectName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  projectType: {
    color: '#0e639c',
    fontSize: 12,
  },
  projectDetails: {
    marginLeft: 44,
  },
  projectPath: {
    color: '#999999',
    fontSize: 11,
    marginBottom: 8,
  },
  projectStats: {
    flexDirection: 'row',
    gap: 12,
  },
  projectStat: {
    color: '#cccccc',
    fontSize: 10,
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#999999',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
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
    width: '90%',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputLabel: {
    color: '#cccccc',
    fontSize: 14,
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#3c3c3c',
    color: '#ffffff',
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  typeSelector: {
    maxHeight: 50,
    marginBottom: 16,
  },
  typeButton: {
    backgroundColor: '#3e3e42',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  typeButtonActive: {
    backgroundColor: '#0e639c',
  },
  typeButtonText: {
    color: '#cccccc',
    fontSize: 12,
  },
  typeButtonTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  cancelModalButton: {
    backgroundColor: '#3e3e42',
  },
  createModalButton: {
    backgroundColor: '#0e639c',
  },
  modalButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default ProjectManager;
