#!/bin/bash
# Setup CosyVoice TTS Service for Xavier OS on Windows

echo "=========================================="
echo "🎵 CosyVoice TTS Setup for Xavier OS"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Create conda environment
echo -e "${BLUE}📍 Step 1: Creating conda environment 'marco'...${NC}"
conda create -n marco python=3.8 -y
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Conda environment created${NC}"
else
  echo -e "${YELLOW}⚠️  Conda environment already exists${NC}"
fi

# 2. Activate environment
echo -e "${BLUE}📍 Step 2: Activating conda environment...${NC}"
source activate marco
if [ $? -ne 0 ]; then
  echo -e "${YELLOW}⚠️  Could not activate conda. Try manually:${NC}"
  echo "   conda activate marco"
fi

# 3. Install PyTorch with CUDA support (optional - install CPU version if no GPU)
echo -e "${BLUE}📍 Step 3: Installing PyTorch...${NC}"
# For GPU (CUDA 11.8):
# conda install pytorch::pytorch pytorch::pytorch-cuda=11.8 -c pytorch -c nvidia -y

# For CPU:
pip install torch torchvision torchaudio
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ PyTorch installed${NC}"
fi

# 4. Install CosyVoice requirements
echo -e "${BLUE}📍 Step 4: Installing CosyVoice dependencies...${NC}"
pip install -r requirements_cosyvoice.txt
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Dependencies installed${NC}"
fi

# 5. Navigate to CosyVoice directory and install
echo -e "${BLUE}📍 Step 5: Installing CosyVoice package...${NC}"
cd /c/Users/leanne/CosyVoice
pip install -e .
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ CosyVoice installed${NC}"
else
  echo -e "${YELLOW}⚠️  Could not install CosyVoice from source. It may still work.${NC}"
fi

# 6. Return to library directory
cd /c/Users/leanne/library

echo -e "${GREEN}=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo -e "${BLUE}To start the CosyVoice TTS service:${NC}"
echo "  1. Open a terminal in: c:\\Users\\leanne\\library"
echo "  2. Run: conda activate marco"
echo "  3. Run: python cosyvoice_service.py"
echo ""
echo -e "${BLUE}The service will start on: ${YELLOW}http://localhost:3003${NC}"
echo ""
echo -e "${BLUE}Your Express backend (port 3002) will automatically detect${NC}"
echo -e "${BLUE}it and use CosyVoice for TTS with emotional voices!${NC}"
echo ""
