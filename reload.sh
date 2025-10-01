#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

echo "[Word-Clock] Pulling latest code..."
git pull --ff-only --rebase --autostash

echo "[Word-Clock] Reloading PM2 processes..."
pm2 reload all

echo "[Word-Clock] Rebooting system..."
# -n = försök utan lösenord; om inte tillåtet faller den tillbaka på vanligt sudo
sudo -n /sbin/reboot 2>/dev/null || sudo /sbin/reboot

# om reboot av någon anledning inte går iväg:
echo "[Word-Clock] Done (waiting for reboot)"
