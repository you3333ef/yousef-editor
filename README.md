# Yousef Editor

A React Native Android application that runs **code-server** (VS Code in browser) on Android devices, with integrated Termux functionality.

## Features

- 🚀 **Code-Server Integration**: Run VS Code directly in your browser on Android
- 💻 **Integrated Terminal**: Built-in Termux terminal for command-line operations
- 📱 **Mobile-Optimized UI**: Designed for Android phones and tablets
- 🌐 **WebView Interface**: Seamless web-based code editing experience
- 🔧 **Git Integration**: Full version control support
- 📂 **File Manager**: Browse and manage your projects
- 🔌 **Plugin Support**: Extend functionality with VS Code extensions

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
