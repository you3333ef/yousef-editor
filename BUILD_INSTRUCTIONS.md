# Building APK Locally

## Prerequisites
- Android Studio or Android SDK
- Java Development Kit (JDK) 11 or higher

## Steps to Build APK

1. **Open Terminal/Command Prompt**

2. **Navigate to project directory**
   ```bash
   cd yousef-editor
   ```

3. **Make gradlew executable (Linux/Mac)**
   ```bash
   chmod +x gradlew
   ```

4. **Build Release APK**
   ```bash
   ./gradlew assembleRelease
   ```

   On Windows:
   ```bash
   gradlew.bat assembleRelease
   ```

5. **APK Location**
   The APK will be created at:
   ```
   app/build/outputs/apk/release/app-release.apk
   ```

## Alternative: Using Android Studio

1. Open Android Studio
2. Select "Open an existing Android Studio project"
3. Navigate to the yousef-editor folder and select it
4. Wait for Gradle sync to complete
5. Go to Build → Build Bundle(s)/APK(s) → Build APK(s)
6. Click "locate" to find the APK file

## Notes

- The app will be in **release mode** and ready for distribution
- You'll need to enable "Unknown Sources" on your Android device to install it
- The app is configured for Android 7.0+ (API 24)
Token updated: Sat Nov  8 17:00:13 +03 2025
