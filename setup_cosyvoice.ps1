# Setup CosyVoice TTS Service for Xavier OS on Windows
# Run this in PowerShell as Administrator

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "🎵 CosyVoice TTS Setup for Xavier OS" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Create conda environment
Write-Host "📍 Step 1: Creating conda environment 'marco'..." -ForegroundColor Blue
conda create -n marco python=3.8 -y
if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ Conda environment created" -ForegroundColor Green
} else {
  Write-Host "⚠️  Conda environment may already exist" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📍 Step 2: Activating conda environment..." -ForegroundColor Blue
# Note: Activate in same process
conda activate marco

if ($LASTEXITCODE -ne 0) {
  Write-Host "⚠️  Could not activate conda. This is normal in PowerShell." -ForegroundColor Yellow
  Write-Host "    You'll need to activate manually: conda activate marco" -ForegroundColor Yellow
  Write-Host ""
  exit 1
}

# 2. Install PyTorch (CPU version for simplicity)
Write-Host ""
Write-Host "📍 Step 3: Installing PyTorch..." -ForegroundColor Blue
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ PyTorch installed" -ForegroundColor Green
} else {
  Write-Host "❌ Failed to install PyTorch" -ForegroundColor Red
  exit 1
}

# 3. Install CosyVoice requirements
Write-Host ""
Write-Host "📍 Step 4: Installing CosyVoice dependencies..." -ForegroundColor Blue
pip install -r requirements_cosyvoice.txt
if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
  Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
  exit 1
}

# 4. Install CosyVoice package
Write-Host ""
Write-Host "📍 Step 5: Installing CosyVoice package..." -ForegroundColor Blue
Push-Location "c:\Users\leanne\CosyVoice"
pip install -e .
if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ CosyVoice installed" -ForegroundColor Green
} else {
  Write-Host "⚠️  Could not install CosyVoice, but it may still work via direct import" -ForegroundColor Yellow
}
Pop-Location

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the CosyVoice TTS service:" -ForegroundColor Blue
Write-Host "  1. Open PowerShell in: c:\Users\leanne\library" -ForegroundColor White
Write-Host "  2. Run: conda activate marco" -ForegroundColor White
Write-Host "  3. Run: python cosyvoice_service.py --model-path c:\Users\leanne\CosyVoice\pretrained_models\CosyVoice2-0.5B" -ForegroundColor White
Write-Host ""
Write-Host "The service will start on: http://localhost:3003" -ForegroundColor Yellow
Write-Host ""
Write-Host "Your Express backend (port 3002) will automatically detect" -ForegroundColor Blue
Write-Host "it and use CosyVoice for expressive TTS with emotional voices!" -ForegroundColor Blue
Write-Host ""
