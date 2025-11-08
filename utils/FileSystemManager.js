import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

class FileSystemManager {
  constructor() {
    this.basePath = '/data/data/com.termux/files/home/yousef-editor';
    this.workspacePath = `${this.basePath}/workspace`;
    this.projectsPath = `${this.basePath}/projects`;
  }

  // Initialize file system
  async initialize() {
    try {
      // Create directories if they don't exist
      await this.createDirectory(this.workspacePath);
      await this.createDirectory(this.projectsPath);
      await this.createDirectory(`${this.basePath}/config`);
      return true;
    } catch (error) {
      console.error('Error initializing file system:', error);
      return false;
    }
  }

  // Directory operations
  async createDirectory(path) {
    try {
      const exists = await RNFS.exists(path);
      if (!exists) {
        await RNFS.mkdir(path);
      }
      return true;
    } catch (error) {
      console.error('Error creating directory:', error);
      return false;
    }
  }

  async listDirectory(path) {
    try {
      const files = await RNFS.readDir(path);
      return files.map(file => ({
        name: file.name,
        path: file.path,
        isDirectory: file.isDirectory(),
        size: file.size,
        mtime: file.mtime,
      }));
    } catch (error) {
      console.error('Error listing directory:', error);
      return [];
    }
  }

  // File operations
  async readFile(path) {
    try {
      const content = await RNFS.readFile(path, 'utf8');
      return content;
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  }

  async writeFile(path, content) {
    try {
      await RNFS.writeFile(path, content, 'utf8');
      await this.saveToHistory(path, content);
      return true;
    } catch (error) {
      console.error('Error writing file:', error);
      return false;
    }
  }

  async deleteFile(path) {
    try {
      await RNFS.unlink(path);
      await this.removeFromHistory(path);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  async copyFile(source, destination) {
    try {
      await RNFS.copyFile(source, destination);
      return true;
    } catch (error) {
      console.error('Error copying file:', error);
      return false;
    }
  }

  async moveFile(source, destination) {
    try {
      await RNFS.moveFile(source, destination);
      return true;
    } catch (error) {
      console.error('Error moving file:', error);
      return false;
    }
  }

  // Project operations
  async createProject(name, type) {
    const projectPath = `${this.projectsPath}/${name}`;
    const projectConfig = {
      name,
      type,
      path: projectPath,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      files: [],
    };

    try {
      await this.createDirectory(projectPath);

      // Create default files based on project type
      if (type === 'React Native') {
        await this.writeFile(`${projectPath}/package.json`, JSON.stringify({
          name,
          version: '0.0.1',
          main: 'index.js',
          dependencies: {
            react: '18.2.0',
            'react-native': '0.72.0',
          },
        }, null, 2));
      } else if (type === 'Android') {
        await this.writeFile(`${projectPath}/MainActivity.java`, 'public class MainActivity {}');
      }

      // Save project config
      const projects = await this.getProjects();
      projects.push(projectConfig);
      await this.saveProjects(projects);

      return projectConfig;
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    }
  }

  async getProjects() {
    try {
      const projectsJson = await AsyncStorage.getItem('projects');
      return projectsJson ? JSON.parse(projectsJson) : [];
    } catch (error) {
      console.error('Error getting projects:', error);
      return [];
    }
  }

  async saveProjects(projects) {
    try {
      await AsyncStorage.setItem('projects', JSON.stringify(projects));
      return true;
    } catch (error) {
      console.error('Error saving projects:', error);
      return false;
    }
  }

  async deleteProject(name) {
    try {
      const projectPath = `${this.projectsPath}/${name}`;
      await RNFS.unlink(projectPath);

      const projects = await this.getProjects();
      const filteredProjects = projects.filter(p => p.name !== name);
      await this.saveProjects(filteredProjects);

      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  }

  // File history (undo/redo)
  async saveToHistory(filePath, content) {
    try {
      const historyKey = `history_${filePath}`;
      const historyJson = await AsyncStorage.getItem(historyKey);
      let history = historyJson ? JSON.parse(historyJson) : [];

      history.push({
        content,
        timestamp: Date.now(),
      });

      // Keep only last 50 versions
      if (history.length > 50) {
        history = history.slice(-50);
      }

      await AsyncStorage.setItem(historyKey, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  }

  async getFileHistory(filePath) {
    try {
      const historyKey = `history_${filePath}`;
      const historyJson = await AsyncStorage.getItem(historyKey);
      return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
      console.error('Error getting file history:', error);
      return [];
    }
  }

  async restoreFromHistory(filePath, index) {
    try {
      const history = await this.getFileHistory(filePath);
      if (history[index]) {
        await this.writeFile(filePath, history[index].content);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error restoring from history:', error);
      return false;
    }
  }

  // Search files
  async searchFiles(query, path = this.basePath) {
    try {
      const files = await RNFS.readDir(path);
      const results = [];

      for (const file of files) {
        if (file.isDirectory()) {
          const subResults = await this.searchFiles(query, file.path);
          results.push(...subResults);
        } else if (file.name.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            name: file.name,
            path: file.path,
            size: file.size,
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Error searching files:', error);
      return [];
    }
  }

  // File info
  async getFileInfo(path) {
    try {
      const stats = await RNFS.stat(path);
      return {
        path,
        size: stats.size,
        isDirectory: stats.isDirectory(),
        mtime: stats.mtime,
        ctime: stats.ctime,
      };
    } catch (error) {
      console.error('Error getting file info:', error);
      return null;
    }
  }

  // Zip/Export
  async exportProject(projectName, destinationPath) {
    try {
      const projectPath = `${this.projectsPath}/${projectName}`;
      await RNFS.copyFile(projectPath, destinationPath);
      return true;
    } catch (error) {
      console.error('Error exporting project:', error);
      return false;
    }
  }

  // Import
  async importProject(sourcePath, projectName) {
    try {
      const projectPath = `${this.projectsPath}/${projectName}`;
      await RNFS.copyFile(sourcePath, projectPath);
      return true;
    } catch (error) {
      console.error('Error importing project:', error);
      return false;
    }
  }

  // Get workspace
  async getWorkspace() {
    try {
      const files = await this.listDirectory(this.workspacePath);
      return files;
    } catch (error) {
      console.error('Error getting workspace:', error);
      return [];
    }
  }
}

export default new FileSystemManager();
