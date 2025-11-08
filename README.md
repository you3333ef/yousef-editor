# Yousef Editor

A powerful React Native Android application that runs **code-server** (VS Code in browser) on Android devices with **multi-tasking support** and **desktop/mobile modes**.

## Key Features

### 🚀 Core Functionality
- **Auto-start Code-Server**: VS Code launches automatically when the app opens
- **WebView Integration**: Run VS Code directly in your browser on Android
- **Termux Terminal**: Built-in terminal for command-line operations

### 📱 Multi-Tasking & Tabs
- **Tab Manager**: Open multiple tabs/windows simultaneously
- **Switch Between Views**: Easily navigate between Code Editor, Files, Terminal, Projects
- **Smart Workspace**: Organize your work with multiple workspaces

### 🖥️ Desktop & Mobile Modes
- **Desktop Mode**: Full IDE layout with side panels (Explorer, Terminal)
- **Mobile Mode**: Optimized touch interface for phones
- **Toggle Anytime**: Switch between modes in settings

### 🔧 Advanced Tools
- **File Explorer**: Browse, create, delete, and manage files
- **Project Manager**: Create and manage multiple projects
- **Settings**: Customize editor, theme, fonts, and behavior
- **Terminal Emulator**: Full-featured terminal with command history

### 📦 Project Management
- **Create Projects**: Support for React Native, Android, Web, Python, Java, and more
- **Project Templates**: Quick start with popular frameworks
- **Recent Projects**: Quick access to your work

## User Flow

1. **Open App** → Code-Server starts automatically
2. **Choose Mode** → Open Multi-Tab Workspace or stay in simple view
3. **Work Efficiently** → Use tabs to switch between Code, Files, Terminal, Projects
4. **Switch Views** → Toggle between desktop and mobile layouts

## Tech Stack

- **React Native 0.72**: Cross-platform mobile framework
- **WebView**: Display code-server interface
- **Android SDK 34**: Latest Android features
- **Java 17**: Modern Java runtime
- **Gradle 8.2**: Build automation

## Building the APK

### GitHub Actions (Recommended)

The project includes a GitHub Actions workflow that automatically builds the APK:

1. Visit: https://github.com/you3333ef/yousef-editor/actions
2. Check the latest workflow run
3. Download the APK from "app-release" artifact

### Manual Build

```bash
# Install dependencies
npm install

# Build APK
gradle assembleRelease
```

The APK will be generated at:
`app/build/outputs/apk/release/app-release.apk`

## How It Works

1. **Start App**: Launch "yousef editor" on your Android device
2. **Code-Server**: Tap "Start Code-Server" to launch VS Code in browser
3. **Terminal**: Use "Open Terminal" for Termux functionality
4. **Code**: Edit files directly in the browser-based VS Code interface

## Project Structure

```
yousef-editor/
├── App.js                 # Main React Native component
├── index.js               # React Native entry point
├── package.json           # Dependencies and scripts
├── app.json              # App metadata
├── react-native.config.js # React Native config
├── metro.config.js       # Metro bundler config
├── app/
│   ├── build.gradle      # Android build configuration
│   └── src/main/
│       ├── java/com/yousef/editor/
│       │   └── MainActivity.kt  # React Native activity
│       └── res/          # Android resources
├── .github/workflows/
│   └── build.yml         # GitHub Actions CI/CD
└── gradle/               # Gradle wrapper
```

## App Configuration

- **App Name**: yousef editor
- **Package**: com.yousef.editor
- **Target SDK**: 34 (Android 14)
- **Min SDK**: 24 (Android 7.0)
- **React Native**: 0.72.0
- **WebView**: Integrated

## Development

### Prerequisites

- Node.js 16+
- Java 17
- Android SDK
- React Native CLI

### Run Locally

```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on Android
npm run android
```

## License

MIT License - Based on VHEditor-Android project concepts
