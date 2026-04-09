@echo off
REM ========================================
REM XAVIER OS - AUDIOBOOK UNIVERSE
REM ONE-TOUCH STARTUP - WINDOWS BATCH
REM ========================================

title Xavier OS - Audiobook Universe
cls

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║        XAVIER OS - AUDIOBOOK UNIVERSE                      ║
echo ║        🎵 Emotional Narration Engine 🎵                    ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Kill any existing Node processes
echo 🧹 Cleaning up existing processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 /nobreak >nul

REM Get local IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /R "IPv4 Address.*[0-9]"') do (
    set "LocalIP=%%a"
    goto :ip_found
)
:ip_found
set "LocalIP=%LocalIP: =%"
if "%LocalIP%"=="" set "LocalIP=127.0.0.1"

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 📱 PHONE CONNECTION INFO
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Your PC IP Address: %LocalIP%
echo On same WiFi, open on phone: http://%LocalIP%:3001
echo.

REM Start TTS Service
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🎵 Starting TTS Service (Port 3003)...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
start "TTS Service" node tts-service.js
timeout /t 2 /nobreak >nul

REM Start CosyVoice Bridge
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🎙️  Starting CosyVoice Bridge (Port 3004)...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
start "CosyVoice Bridge" node cosyvoice-bridge.js
timeout /t 2 /nobreak >nul

REM Start Express Backend
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ⚙️  Starting Express Backend (Port 3002)...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
start "Express Backend" node server.js
timeout /t 2 /nobreak >nul

REM Start React Frontend
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ⚛️  Starting React Frontend (Port 3001)...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
start "React Frontend" npx vite --port 3001 --host 0.0.0.0
timeout /t 3 /nobreak >nul

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║          ✅ ALL SYSTEMS ONLINE                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo 🖥️  DESKTOP ACCESS:
echo    Browser: http://localhost:3001
echo.

echo 📱 PHONE ACCESS (on same WiFi):
echo    Browser: http://%LocalIP%:3001
echo.

echo 🔌 SERVICES RUNNING:
echo    ✅ TTS Service ........... http://%LocalIP%:3003
echo    ✅ CosyVoice Bridge ..... http://%LocalIP%:3004
echo    ✅ Express Backend ...... http://%LocalIP%:3002
echo    ✅ React Frontend ....... http://%LocalIP%:3001
echo.

echo 💡 TIPS:
echo    • Make sure phone is on same WiFi as PC
echo    • If connection fails, check firewall settings
echo    • Close the service windows to stop all services
echo.

REM Open browser
start http://localhost:3001

echo 🎧 System running! Enjoy your audiobooks...
echo.
pause
