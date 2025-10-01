#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

echo "[Word-Clock] Pulling latest code..."
git pull --ff-only

echo "[Word-Clock] Rebooting system..."
sudo -n /sbin/reboot 2>/dev/null || sudo /sbin/reboot
