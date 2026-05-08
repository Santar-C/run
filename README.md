# ⚔️ BEASTBORNE — Fitness App

Mobile-first fitness app with RPG quest mode, trainer mode, and GPS run/bike tracker.  
No framework · No backend · Pure HTML/CSS/JS · Works offline (PWA)

---

## 📁 File Structure

```
/
├── index.html       ← Mode selector (start here)
├── beastborne.html  ← ⚔️ BEASTBORNE RPG Mode
├── draglak.html     ← 💀 "กูจะลากมึงเอง" Trainer Mode
├── run.html         ← 🏃🚴 GPS Run + Bike Tracker
└── store.js         ← Shared data bridge (imported by RPG pages)
```

All files link to each other and share data via `localStorage`.

---

## 🔗 How Pages Connect

```
index.html
  ├── → beastborne.html  (imports store.js, auto-syncs GPS data)
  ├── → draglak.html     (imports store.js, auto-syncs GPS data)
  └── → run.html
         ├── Run GPS session → saves to BB_Runs
         ├── Bike GPS session → saves to BB_Bikes
         └── XP reward → injected into RPG state on save
```

When you finish a run/bike in `run.html`:
- Saves to shared `BB_Runs` / `BB_Bikes` store
- Injects XP directly into your active RPG mode state
- Returns you to the RPG page with updated stats

---

## 🚀 Deploy on GitHub Pages (free HTTPS)

1. Fork or create a repo, upload all 4 files
2. **Settings → Pages → Branch: main → / (root)**
3. Your app lives at: `https://YOUR_USERNAME.github.io/REPO_NAME/`
4. HTTPS is required for GPS Geolocation API — GitHub Pages provides this automatically

---

## 📱 Add to Home Screen (PWA)

### iOS Safari
1. Open the URL in **Safari** (not Chrome)
2. Tap the **Share ⎋** button
3. Scroll → tap **"Add to Home Screen"**
4. Opens fullscreen like a native app, no address bar

### Android Chrome
1. Open URL in **Chrome**
2. Tap **⋮ menu** → **"Add to Home screen"**  
   or Chrome shows an install banner automatically
3. Tap the icon on your home screen — launches fullscreen

> **Tip:** Add `index.html` to home screen. Then use the cards inside to navigate to each mode.

---

## ⌚ Smartwatch Support

| Device | Support |
|--------|---------|
| Android phone | ✅ Full (GPS + maps + all features) |
| iPhone | ✅ Full via Safari |
| WearOS watch (Samsung etc.) | ⚠️ Browser opens, large text readable, but GPS may not work reliably in watch browser |
| Apple Watch | ❌ No standalone browser with GPS |
| Garmin / Polar | ❌ No browser |

**Best approach for smartwatches:** Run the app on your phone (in pocket/armband), glance at your phone or use the share button after the run to export stats.

---

## ❤️ Heart Rate (HR) — Why It Shows "--"

**HR cannot be read from GPS or the web browser** on most devices:

- **iOS Safari**: Web Bluetooth HR is blocked by Apple
- **Android Chrome**: Web Bluetooth API works but requires a **paired BLE HR sensor** (e.g., Polar H10, Garmin HRM-Pro)
- **Smartwatch browser**: Still can't access the watch's own HR sensor via web APIs

**To see HR in the app:**
- Log HR manually in the RPG Log tab after your workout
- Or use a dedicated app (Garmin Connect, Polar Flow, Strava) for HR recording, then note it manually

> Future enhancement: Web Bluetooth GATT pairing with a Polar H10 is possible — PRs welcome!

---

## 📡 GPS Accuracy

| Condition | Accuracy |
|-----------|----------|
| Open sky, outdoors | ±5–15m (excellent) |
| Urban canyons | ±20–50m (acceptable) |
| Indoors | ±50–200m+ (unreliable) |
| Starting cold | First 30–60 sec may drift |

The app shows GPS accuracy live (e.g., `±12m`) and **filters out noise**:
- Points closer than 2m (run) or 3m (bike) are ignored
- Points with accuracy >100m are skipped after a good fix is established
- Speed is calculated as a rolling 7-point average to smooth spikes

> **For best accuracy:** Start outside in open sky, wait for the GPS ring to turn green before moving.

---

## 🗺 RPG Adventure Map (Beastborne Mode)

When launching a run/bike from Beastborne mode:
- Map tiles are styled with a **dark fantasy filter** (sepia + deep shadows)
- Your position marker becomes a **golden ⚔ sword icon**
- Random **territory labels** appear on the map (ป่าต้องห้าม, ปราสาทมืด etc.)
- Distance shows in gold **Cinzel** font instead of Bebas Neue
- The HUD shows your **knight name and class**
- The map theme cycles: RPG → Cycling → Standard via the 🗺 button

---

## ✨ Feature Summary

### 🏰 BEASTBORNE
- RPG character (LV 1–50+, 7 classes: Squire → Legendary Knight)
- 15 quests with XP rewards  
- Boss battle metaphor for weight/fitness goals
- Marathon readiness score (5 factors)
- Weekly training plan (10K / 21K / 42K)
- Workout generator (10 equipment types, SVG diagrams)
- **Auto-syncs GPS run/bike distance** from Run Tracker

### 💀 กูจะลากมึงเอง
- Same features, roast-style coach persona
- **Auto-syncs** GPS data too

### 🏃🚴 Run & Ride Tracker
- Live GPS tracking (Leaflet.js + OpenStreetMap)
- Real-time: distance, pace (run) / speed (bike), elapsed time
- Lap tracking with per-lap analysis
- Elevation profile chart
- **Bike mode**: speed gauge ring, power zones, cycling-tinted map
- **RPG map mode**: fantasy tile filter, territory labels, sword marker
- Full run/ride summary with route map
- History of all activities (separate Run / Bike tabs)
- Web Share API for sharing results
- **XP reward** auto-injected into RPG mode on save
- Demo GPS fallback when location not permitted

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| UI | Vanilla HTML5 / CSS3 / ES6 JS |
| Maps | Leaflet.js 1.9.4 + OpenStreetMap |
| GPS | `navigator.geolocation.watchPosition` |
| Storage | `localStorage` (device-only, private) |
| Fonts | Google Fonts (Bebas Neue, Cinzel, Sarabun) |
| Icons | Emoji + inline SVG |
| PWA | Web App Manifest + `beforeinstallprompt` |

---

## 💾 Data & Backup

All data stays on your device in `localStorage`. To back up:
- **RPG modes**: tap the **Backup** button in the Analytics tab — copies a base64 string to clipboard. Save in Notes.
- **GPS data**: currently device-only. Export via the share button after each activity.

---

## 🤝 Contributing / Ideas

- [ ] Web Bluetooth HR sensor integration (Polar H10)
- [ ] Strava OAuth auto-sync after GPS activity
- [ ] Offline tile caching via Service Worker
- [ ] Better GPS smoothing (Kalman filter)
- [ ] Garmin Connect manual import helper

PRs and issues welcome at `github.com/YOUR_USERNAME/beastborne`
