# 🚀 Quick Start Guide

## Get Yousef Editor Running in 3 Steps!

### Step 1: Build the APK
```bash
cd /path/to/yousef-editor
./gradlew assembleDebug
```

### Step 2: Install on Device
```bash
# Connect Android device via USB
adb install app/build/outputs/apk/debug/app-debug.apk
```

### Step 3: Set Up Code-Server
```bash
# In Termux (install from F-Droid)
pkg update
pkg install nodejs
npm install -g code-server
code-server --port 8080
```

### Step 4: Open App
1. Launch Yousef Editor
2. App connects automatically ✅
3. VS Code loads in WebView ✅

## Having Issues?

### Code-server not running?
- App shows error screen
- Tap "Install Termux" to set up
- Or use "External URL" for remote server

### Want to build via GitHub Actions?
1. Push to GitHub
2. Actions builds automatically
3. Download APK from artifacts

## Features

- ✅ Multi-tab support
- ✅ Background service
- ✅ Settings management
- ✅ Connection monitoring
- ✅ Notifications
- ✅ Auto-start

## More Info

- 📖 Full docs: `BUILD_GUIDE.md`
- 🔍 Analysis: `VHEDITOR_MERGE_ANALYSIS.md`
- 📊 Summary: `PROJECT_SUMMARY.md`

---

**Status: ✅ Ready to Build and Deploy!**
