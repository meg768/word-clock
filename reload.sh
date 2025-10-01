#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

echo "Pulling latest code..."
sudo git pull --ff-only

echo "Rebooting system..."
sudo -n /sbin/reboot 2>/dev/null || sudo /sbin/reboot
