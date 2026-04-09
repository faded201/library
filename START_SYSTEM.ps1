# ========================================
# XAVIER OS - AUDIOBOOK UNIVERSE
# ONE-TOUCH STARTUP SYSTEM
# ========================================

$ErrorActionPreference = "Continue"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

Clear-Host
Write-Host "`n" -NoNewline
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "║        XAVIER OS - AUDIOBOOK UNIVERSE                      ║" -ForegroundColor Cyan
Write-Host "║        🎵 Emotional Narration Engine 🎵                    ║" -ForegroundColor Cyan
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Kill any existing Node processes to avoid port conflicts
Write-Host "🧹 Cleaning up existing processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 500

# Get current PC IP for phone connection
$ipConfig = ipconfig | Select-String "IPv4 Address" | Select-Object -First 1
$localIP = if ($ipConfig) { 
    ($ipConfig -split ': ')[1].Trim() 
} else { 
    "127.0.0.1" 
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📱 PHONE CONNECTION INFO" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Your PC IP Address: " -ForegroundColor White -NoNewline
Write-Host $localIP -ForegroundColor Yellow
Write-Host "On same WiFi, open on phone: " -ForegroundColor White -NoNewline
Write-Host "http://$localIP:3001" -ForegroundColor Yellow
Write-Host ""

# Start TTS Service
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎵 Starting TTS Service (Port 3003)..." -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit -Command `"Set-Location '$scriptPath'; node tts-service.js`"" -WindowStyle Normal
Start-Sleep -Seconds 2

# Start CosyVoice Bridge
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎙️  Starting CosyVoice Bridge (Port 3004)..." -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit -Command `"Set-Location '$scriptPath'; node cosyvoice-bridge.js`"" -WindowStyle Normal
Start-Sleep -Seconds 2

# Start Express Backend
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "⚙️  Starting Express Backend (Port 3002)..." -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit -Command `"Set-Location '$scriptPath'; node server.js`"" -WindowStyle Normal
Start-Sleep -Seconds 2

# Start React Frontend
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "⚛️  Starting React Frontend (Port 3001)..." -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit -Command `"Set-Location '$scriptPath'; npx vite --port 3001 --host 0.0.0.0`"" -WindowStyle Normal
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║          ✅ ALL SYSTEMS ONLINE                            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "🖥️  DESKTOP ACCESS:" -ForegroundColor Cyan
Write-Host "   Browser: " -ForegroundColor White -NoNewline
Write-Host "http://localhost:3001" -ForegroundColor Yellow
Write-Host ""

Write-Host "📱 PHONE ACCESS (on same WiFi):" -ForegroundColor Cyan
Write-Host "   Browser: " -ForegroundColor White -NoNewline
Write-Host "http://$localIP:3001" -ForegroundColor Yellow
Write-Host ""

Write-Host "🔌 SERVICES RUNNING:" -ForegroundColor Cyan
Write-Host "   ✅ TTS Service ........... http://$localIP:3003" -ForegroundColor Green
Write-Host "   ✅ CosyVoice Bridge ..... http://$localIP:3004" -ForegroundColor Green
Write-Host "   ✅ Express Backend ...... http://$localIP:3002" -ForegroundColor Green
Write-Host "   ✅ React Frontend ....... http://$localIP:3001" -ForegroundColor Green
Write-Host ""

Write-Host "💡 TIPS:" -ForegroundColor Yellow
Write-Host "   • Make sure phone is on same WiFi as PC" -ForegroundColor White
Write-Host "   • If connection fails, check firewall settings" -ForegroundColor White
Write-Host "   • Close this window to stop all services" -ForegroundColor White
Write-Host ""

Write-Host "Press ENTER to open browser..." -ForegroundColor White
Read-Host | Out-Null

# Open browser
Start-Process "http://localhost:3001"

Write-Host ""
Write-Host "🎧 System running! Enjoy your audiobooks..." -ForegroundColor Green
Write-Host ""
