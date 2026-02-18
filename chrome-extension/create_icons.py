"""Generate placeholder PNG icons for SentinelGate Chrome extension."""
import base64
import os

# Minimal valid 1x1 blue pixel PNG - Chrome will scale it
ICON_B64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDQAFhQGApKkXKwAAAABJRU5ErkJggg=="

os.makedirs("icons", exist_ok=True)
png = base64.b64decode(ICON_B64)
for size in [16, 48, 128]:
    with open(f"icons/icon{size}.png", "wb") as f:
        f.write(png)
print("Icons created: icon16.png, icon48.png, icon128.png")
