# Yousef Editor - Android Code Editor with AI Integration

## 🚀 Overview

**Yousef Editor** is a powerful Android code editor that brings the full VS Code experience to your mobile device, powered by code-server and enhanced with AI assistance from 8 different providers.

This is a complete implementation of VHEditor functionality with significant enhancements, including multi-provider AI integration, advanced settings, and comprehensive features.

## ✨ Key Features

### 🔥 Core Functionality (VHEditor Parity)

- ✅ **Code-Server Integration** - Full VS Code running in browser
- ✅ **Termux Integration** - Terminal emulator with full command support
- ✅ **File System Access** - Browse, create, edit, delete files
- ✅ **Project Management** - Create and manage coding projects
- ✅ **Multi-Tab Support** - 8 tabs for multitasking
- ✅ **Mobile & Desktop Modes** - Switch between layouts
- ✅ **Auto-Start** - Code-server starts automatically
- ✅ **Session Restore** - Resume where you left off

### 🤖 AI Providers (8 Total - Enhanced from VHEditor)

1. **Anthropic Claude** (4 models)
   - Claude 3.5 Sonnet
   - Claude 3 Opus
   - Claude 3 Sonnet
   - Claude 3 Haiku

2. **OpenAI** (4 models)
   - GPT-4o
   - GPT-4o Mini
   - GPT-4 Turbo
   - GPT-3.5 Turbo

3. **Google Gemini** (3 models)
   - Gemini 1.5 Pro
   - Gemini 1.5 Flash
   - Gemini Pro

4. **Cohere** (3 models)
   - Command R+
   - Command R
   - Command

5. **Together AI** (4 models)
   - Llama 3.1 70B
   - Llama 3.1 8B
   - Qwen 2.5 72B
   - Mixtral 8x7B

6. **Ollama (Local)** (4 models)
   - Llama 3.1 8B
   - Llama 3.1 70B
   - Code Llama
   - Mistral 7B

7. **OpenRouter** (6 models)
   - Access to multiple models via one API
   - GPT-4o, Claude 3.5 Sonnet, Gemini Pro
   - Llama 3.1 70B, Mixtral 8x7B, Qwen 2.5 72B

8. **MiniMax AI** (6 models)
   - abab6.5s-chat
   - abab6.5g-chat
   - abab6.5-chat
   - abab5.5s-chat
   - abab5.5g-chat
   - abab5.5-chat

**Total: 34+ AI Models across 8 providers**

### 📱 Interface & Navigation

- **9 Main Tabs:**
  1. ✨ Features - Overview of all features
  2. 📝 Code Editor - VS Code in WebView
  3. 📁 Files - File explorer
  4. 💻 Terminal - Terminal emulator
  5. 📦 Projects - Project management
  6. ⚙️ Settings - Configuration
  7. 🤖 Claude AI - AI chat assistant
  8. 🚀 Startup - Startup options
  9. 🔑 API Config - API settings

### 🔧 Advanced Features

- **Auto-Save** - Automatic file saving with customizable intervals
- **Cloud Sync** - Backup and sync settings across devices
- **File History** - 50 version history for each file
- **File Search** - Search across all project files
- **Settings Persistence** - All settings saved to AsyncStorage
- **Session Management** - Save and restore workspaces
- **Dark Theme** - Built-in dark/light themes
- **Font Customization** - Adjustable font sizes
- **Line Numbers** - Toggle line numbers
- **Word Wrap** - Configurable text wrapping
- **Minimap** - Code minimap display

## 🏗️ Technical Architecture

### Frontend
- **React Native 0.72** - Cross-platform mobile framework
- **WebView Integration** - Code-server browser interface
- **AsyncStorage** - Settings and data persistence

### Backend Simulation
- **AIProvider Service** - Multi-provider AI integration
- **SettingsManager** - Centralized settings management
- **FileSystemManager** - File operations abstraction

### Build System
- **Gradle 8.2** - Android build system
- **Java 17** - Programming language
- **Android SDK 34** - Android development platform
- **GitHub Actions** - CI/CD for automatic APK building

## 🚀 Quick Start

### 1. Open the App
The app starts with the **Features** tab showing an overview of all capabilities.

### 2. Configure AI Provider
1. Click the **Settings** tab (⚙️)
2. Select **AI Providers** tab
3. Choose your provider (e.g., Anthropic, OpenAI, etc.)
4. Enter your API key
5. Select a model
6. Click **Test Connection**
7. Click **Save All Settings**

### 3. Start Coding
1. Click the **Code Editor** tab (📝)
2. Code-server starts automatically in mobile mode
3. Use the terminal, file explorer, and AI assistant as needed

### 4. Customize Experience
- Go to **Settings** → **Display** to toggle desktop/mobile mode
- Go to **Settings** → **Startup** to configure auto-start behavior
- Go to **Settings** → **Editor** to adjust editor preferences

## 📊 Statistics

- **8 AI Providers** - More than any other mobile code editor
- **34+ AI Models** - Vast selection of models
- **9 Main Tabs** - Comprehensive workspace
- **50 File History** - Version control built-in
- **100% VHEditor Parity** - All VHEditor features plus more

## 🔑 API Key Configuration

### Anthropic Claude
1. Visit: https://console.anthropic.com/
2. Create account and generate API key
3. Format: `sk-ant-...`
4. Recommended model: Claude 3.5 Sonnet

### OpenAI
1. Visit: https://platform.openai.com/
2. Create account and generate API key
3. Format: `sk-...`
4. Recommended model: GPT-4o

### Google Gemini
1. Visit: https://makersuite.google.com/
2. Create account and generate API key
3. Format: Alphanumeric string
4. Recommended model: Gemini 1.5 Pro

### OpenRouter
1. Visit: https://openrouter.ai/
2. Create account and generate API key
3. Format: `sk-or-...`
4. Access to multiple models via one API

### MiniMax AI
1. Visit: https://api.minimax.chat/
2. Create account and generate API key
3. Format: JWT token
4. Recommended model: abab6.5s-chat

### Local Models (Ollama)
1. Install Ollama: https://ollama.ai/
2. Run: `ollama serve`
3. Pull models: `ollama pull llama3.1`
4. No API key required

## 📱 App Structure

```
yousef-editor/
├── components/           # React components
│   ├── TabManager.js     # Main tab system
│   ├── CodeEditor.js     # WebView code editor
│   ├── FileExplorer.js   # File browser
│   ├── Terminal.js       # Terminal emulator
│   ├── ProjectManager.js # Project management
│   ├── Settings.js       # Settings interface
│   ├── ClaudeAssistant.js # AI chat
│   ├── VHEditorFeatures.js # Features overview
│   ├── APIConfig.js      # API configuration
│   └── StartupConfig.js  # Startup options
├── services/             # Business logic
│   └── AIProvider.js     # AI integration
├── utils/                # Utilities
│   ├── SettingsManager.js # Settings persistence
│   └── FileSystemManager.js # File operations
├── App.js                # Main app component
├── index.js              # Entry point
├── build.gradle          # Android build config
└── settings.gradle       # Gradle settings
```

## 🎯 VHEditor Comparison

| Feature | VHEditor | Yousef Editor |
|---------|----------|---------------|
| Code-Server | ✅ | ✅ |
| Termux | ✅ | ✅ |
| AI Assistant | 1 provider | **8 providers** |
| Models | ~4 | **34+** |
| Multi-Tab | ❌ | ✅ |
| Auto-Start | ❌ | ✅ |
| Settings | Basic | **Comprehensive** |
| Cloud Sync | ❌ | ✅ |
| File History | ❌ | ✅ |
| Session Restore | ❌ | ✅ |
| Mobile/Desktop Mode | ❌ | ✅ |
| Mobile UI | ❌ | ✅ |

**Yousef Editor = VHEditor + 8x More AI Providers + Enhanced Features**

## 🔄 Auto-Start Configuration

The app can be configured to:
- Auto-start code-server on app launch
- Start in desktop or mobile mode
- Restore last session
- Auto-focus terminal
- Open last project
- Show welcome screen

## 💾 Auto-Save

- Configurable intervals (5s, 10s, 30s, 60s, etc.)
- Saves current file automatically
- 50 version history
- Restore from history
- Cloud backup

## 🌐 Cloud Sync

- Backup all settings
- Sync across devices
- Export/import configurations
- Version tracking
- Local backup simulation

## 🎨 Themes

- Dark theme (default)
- Light theme
- Custom color schemes
- Accent color customization
- Syntax highlighting

## 📦 Project Management

- Create new projects
- Import existing projects
- Export projects
- Project templates (React Native, Android, etc.)
- Project history
- Recent projects list

## 💻 Terminal Features

- Command history
- Multiple terminal sessions
- Copy/paste
- Customizable font
- Command suggestions
- Error highlighting

## 🤖 AI Assistant Features

- Real-time code suggestions
- Chat interface
- Quick prompts
- Code generation
- Bug detection
- Best practices
- Architecture advice
- Documentation help

## 🛠️ Development

### Build APK
```bash
./gradlew clean assembleRelease
```

### Run in Debug
```bash
./gradlew assembleDebug
```

## 📄 License

This project is for educational and development purposes.

## 🙏 Acknowledgments

- VHEditor for the original concept
- Code-Server for browser-based VS Code
- All AI providers for their APIs
- React Native team for the framework
- Android team for the platform

## 📞 Support

For issues, feature requests, or contributions, please visit the project repository.

---

**Built with ❤️ for developers who code on the go**
