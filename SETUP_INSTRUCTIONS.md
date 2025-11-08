# 📱 Yousef Editor - Setup Instructions

## 🚀 How to Set Up Code-Server

Yousef Editor is a **WebView app** that loads code-server (VS Code in browser). You need to install and run code-server separately using **Termux**.

### 📋 Step-by-Step Guide

#### Step 1: Install Termux
```
Option 1: F-Droid (Recommended)
1. Download F-Droid: https://f-droid.org/
2. Install F-Droid
3. Search for "Termux" and install

Option 2: Google Play Store
1. Search for "Termux" in Play Store
2. Install the official Termux app
```

#### Step 2: Open Termux
1. Launch Termux app
2. Update packages:
```bash
pkg update
pkg upgrade
```

#### Step 3: Install Node.js
```bash
pkg install nodejs
```

#### Step 4: Install Code-Server
```bash
npm install -g code-server
```

#### Step 5: Start Code-Server
```bash
code-server --port 8080
```

**That's it!** Code-server will start on port 8080. You can now:
- Open Yousef Editor app
- It will automatically connect to code-server
- Enjoy VS Code in your browser on Android!

### 🔧 Alternative Setup

#### Using External Code-Server
If you have code-server running on a different device or port:

1. Open Yousef Editor
2. When you see the error, tap **"Use External URL"**
3. Enter your code-server URL, e.g.:
   - `http://192.168.1.100:8080` (local network)
   - `http://your-server.com:8080` (remote server)

### 🎯 What Yousef Editor Does

✅ **Checks** if code-server is running
✅ **Loads** code-server in WebView
✅ **Provides** setup instructions
✅ **Supports** external code-server URLs
✅ **Handles** errors gracefully

### 🔍 Troubleshooting

#### Problem: "Cannot connect to code-server"
**Solution:**
1. Make sure code-server is running: `code-server --port 8080`
2. Check if port 8080 is not blocked by firewall
3. Try a different port: `code-server --port 3000`

#### Problem: "Code-server not installed"
**Solution:**
1. Install Node.js: `pkg install nodejs`
2. Install code-server: `npm install -g code-server`
3. Start code-server: `code-server --port 8080`

#### Problem: "Termux not found"
**Solution:**
1. Download from F-Droid: https://f-droid.org/packages/com.termux/
2. Or from GitHub: https://github.com/termux/termux-app

#### Problem: "Slow or Laggy"
**Solution:**
1. Close other apps
2. Use lower-end models for better performance
3. Try a different port

### 📱 Features

| Feature | Description |
|---------|-------------|
| WebView | Loads code-server interface |
| Zoom | Pinch to zoom in/out |
| Navigation | Back button support |
| Error Handling | Clear error messages |
| External URL | Connect to remote code-server |
| Termux Integration | Opens Termux setup page |
| Auto-Connect | Checks connection on startup |

### 🎨 Code-Server in Yousef Editor

**What you get:**
- Full VS Code in browser
- All VS Code extensions
- Terminal integration
- File explorer
- Git support
- Debugging tools
- Themes and customization

### 🔑 API Integration (Bonus!)

While you can't run React Native code in this native app, you can still:
- View the React Native code in code-server
- Modify the React Native app source
- See all 8 AI providers implementation
- Review all documentation files

### 📞 Need Help?

**If code-server doesn't work:**
1. Check Termux is installed
2. Verify Node.js: `node --version`
3. Install code-server: `npm install -g code-server`
4. Start code-server: `code-server --port 8080`
5. Open Yousef Editor app

### 🎉 Success!

When everything is set up correctly:
1. Yousef Editor shows "Yousef Editor" title
2. WebView loads code-server
3. You see VS Code interface
4. You can start coding on Android!

---

**Built with ❤️ for mobile development**
