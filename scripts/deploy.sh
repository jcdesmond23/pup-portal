#!/bin/bash
set -e

echo "=== Starting Pi deployment ==="

# Copy frontend build to web directory
echo "Setting up frontend..."
sudo mkdir -p /var/www/html
sudo cp -r frontend/dist/* /var/www/html/

# Install backend requirements
echo "Installing Python dependencies..."
cd backend
python3 -m pip install --user -r requirements.txt
cd ..

# Setup systemd service
echo "Setting up systemd service..."
cat > /tmp/pup-portal-backend.service << EOF
[Unit]
Description=Pup Portal Backend
After=network.target

[Service]
ExecStart=/usr/bin/python3 $HOME/pup-portal/backend/app.py
WorkingDirectory=$HOME/pup-portal/backend
User=$USER
Group=$USER
Restart=always
RestartSec=10
Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=multi-user.target
EOF

sudo mv /tmp/pup-portal-backend.service /etc/systemd/system/

# Setup Nginx
if [ ! -f /etc/nginx/sites-available/pup-portal ]; then
  echo "Setting up Nginx..."
  sudo apt-get update
  sudo apt-get install -y nginx
  
  cat > /tmp/pup-portal << EOF
server {
    listen 80;
    server_name _;
    
    root /var/www/html;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF
  
  sudo mv /tmp/pup-portal /etc/nginx/sites-available/
  sudo ln -sf /etc/nginx/sites-available/pup-portal /etc/nginx/sites-enabled/
  sudo rm -f /etc/nginx/sites-enabled/default
fi

# Restart services
echo "Restarting services..."
sudo systemctl daemon-reload
sudo systemctl restart pup-portal-backend.service
sudo systemctl enable pup-portal-backend.service
sudo systemctl restart nginx

echo "=== Deployment complete! ==="
