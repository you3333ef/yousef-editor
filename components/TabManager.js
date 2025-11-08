import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import CodeEditor from './CodeEditor';
import FileExplorer from './FileExplorer';
import Terminal from './Terminal';
import Settings from './Settings';
import ProjectManager from './ProjectManager';

const TABS = {
  CODE_EDITOR: { id: 'code-editor', title: 'Code Editor', icon: '📝' },
  FILE_EXPLORER: { id: 'file-explorer', title: 'Files', icon: '📁' },
  TERMINAL: { id: 'terminal', title: 'Terminal', icon: '💻' },
  PROJECT: { id: 'project', title: 'Projects', icon: '📦' },
  SETTINGS: { id: 'settings', title: 'Settings', icon: '⚙️' },
};

const TabManager = ({isDesktopMode, onToggleMode}) => {
  const [activeTab, setActiveTab] = useState('code-editor');
  const [openTabs, setOpenTabs] = useState(['code-editor']);

  const openTab = (tabId) => {
    if (!openTabs.includes(tabId)) {
      setOpenTabs([...openTabs, tabId]);
    }
    setActiveTab(tabId);
  };

  const closeTab = (tabId) => {
    const newTabs = openTabs.filter(id => id !== tabId);
    setOpenTabs(newTabs);
    if (activeTab === tabId && newTabs.length > 0) {
      setActiveTab(newTabs[0]);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'code-editor':
        return <CodeEditor isDesktopMode={isDesktopMode} />;
      case 'file-explorer':
        return <FileExplorer />;
      case 'terminal':
        return <Terminal />;
      case 'project':
        return <ProjectManager onOpenProject={openTab} />;
      case 'settings':
        return <Settings isDesktopMode={isDesktopMode} onToggleMode={onToggleMode} />;
      default:
        return <CodeEditor isDesktopMode={isDesktopMode} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {openTabs.map(tabId => {
            const tab = Object.values(TABS).find(t => t.id === tabId);
            return (
              <TouchableOpacity
                key={tabId}
                style={[
                  styles.tab,
                  activeTab === tabId && styles.activeTab
                ]}
                onPress={() => setActiveTab(tabId)}>
                <Text style={styles.tabIcon}>{tab?.icon}</Text>
                <Text style={[
                  styles.tabTitle,
                  activeTab === tabId && styles.activeTabTitle
                ]}>
                  {tab?.title}
                </Text>
                {openTabs.length > 1 && (
                  <TouchableOpacity
                    onPress={() => closeTab(tabId)}
                    style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>×</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Add Tab Button */}
        <TouchableOpacity
          style={styles.addTabButton}
          onPress={() => {
            // Show tab selector
            const availableTabs = Object.values(TABS).filter(
              t => !openTabs.includes(t.id)
            );
            if (availableTabs.length > 0) {
              openTab(availableTabs[0].id);
            }
          }}>
          <Text style={styles.addTabText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={[
        styles.tabContent,
        isDesktopMode && styles.desktopContent
      ]}>
        {renderTabContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#2d2d30',
    borderBottomWidth: 1,
    borderBottomColor: '#3e3e42',
    alignItems: 'center',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRightWidth: 1,
    borderRightColor: '#3e3e42',
    minWidth: 100,
  },
  activeTab: {
    backgroundColor: '#1e1e1e',
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  tabTitle: {
    color: '#cccccc',
    fontSize: 13,
  },
  activeTabTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  closeButton: {
    marginLeft: 6,
    padding: 2,
  },
  closeButtonText: {
    color: '#cccccc',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addTabButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#3e3e42',
  },
  addTabText: {
    color: '#cccccc',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
  },
  desktopContent: {
    flexDirection: 'row',
  },
});

export default TabManager;
export {TABS};
