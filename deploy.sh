#!/bin/bash
# deploy.sh

# Build frontend
cd frontend
npm run build

# Create deployment package
mkdir -p ~/deploy-package
cp -r ../backend ~/deploy-package/
cp -r dist ~/deploy-package/frontend

# Transfer to Raspberry Pi (add your Pi's IP)
scp -i ~/.ssh/pi-deploy -r ~/deploy-package/* pi@raspberrypi.local:~/pup-portal/

# Delete deployment package
rm -rf ~/deploy-package

echo "Deployment package transferred to Raspberry Pi"