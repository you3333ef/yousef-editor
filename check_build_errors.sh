#!/bin/bash
echo "=== CHECKING FOR KOTLIN SYNTAX ERRORS ==="
echo ""

echo "1. Checking MainActivity.kt for syntax issues..."
grep -n "import.*Tab" app/src/main/java/com/yousef/editor/MainActivity.kt

echo ""
echo "2. Checking TabManager.kt for Tab class definition..."
grep -n "data class Tab" app/src/main/java/com/yousef/editor/tabs/TabManager.kt

echo ""
echo "3. Checking MainActivity for any unresolved references..."
grep -n "Tab" app/src/main/java/com/yousef/editor/MainActivity.kt | head -20

echo ""
echo "4. Checking for any syntax issues in MainActivity..."
awk '/class MainActivity/,/^}/' app/src/main/java/com/yousef/editor/MainActivity.kt | head -100

echo ""
echo "5. Checking for any missing semicolons or brackets..."
grep -n "fun onCreate" app/src/main/java/com/yousef/editor/MainActivity.kt -A 20

echo ""
echo "=== CHECKING IMPORT STATEMENTS ==="
head -30 app/src/main/java/com/yousef/editor/MainActivity.kt

echo ""
echo "=== CHECKING TabManager COMPLETE DEFINITION ==="
cat app/src/main/java/com/yousef/editor/tabs/TabManager.kt

echo ""
echo "=== CHECKING SETTINGS MANAGER ==="
head -50 app/src/main/java/com/yousef/editor/prefs/SettingsManager.kt

echo ""
echo "=== CHECKING CODE SERVER SERVICE ==="
head -50 app/src/main/java/com/yousef/editor/service/CodeServerService.kt
