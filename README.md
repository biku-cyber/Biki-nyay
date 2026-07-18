ME.md
# ন্যায়সেতু — NyaySetu

**ভাৰতীয় সংবিধান আৰু আইন — অসমীয়াত**

An offline-first Progressive Web App that makes the Indian Constitution and modern criminal laws accessible in Assamese — beautifully, fast, and without internet.

## ✨ Features

- 📜 **Constitution**: Preamble, Parts, Schedules, Amendments
- ⚖️ **Laws**: BNS, BNSS, BSA (new criminal laws) + IPC, CrPC (historical)
- 🔍 **Global Search**: across all laws with highlighted matches
- 🔖 **Bookmarks**: grouped by law, persisted locally
- 🕐 **Continue Reading**: pick up exactly where you left off
- 🌐 **Reader Toolbar**: Translate, Live Read (TTS), Keep Screen On, Bookmark
- 🌙 **Eye-Comfort Themes**: Day (warm paper), Night (dark olive), Light
- ⚙️ **Settings**: font size, line height, speech rate/pitch, theme
- 📴 **100% Offline**: Service Worker + JSON data, zero CDN
- 📱 **PWA**: installable, mobile-optimized, safe-area aware

## 🏗️ Architecture

pure HTML5 + CSS3 + Vanilla JavaScript
No frameworks. No build step. No CDN. No external fonts.


- **Offline-first**: Service Worker caches all assets on first load
- **Modular JS**: Each concern in its own file (router, storage, reader, speech…)
- **JSON data**: All content lives in `data/*.json` — swap data without touching code
- **LocalStorage**: Settings, bookmarks, last-read position
- **Web APIs**: SpeechSynthesis (TTS), Wake Lock (screen-on), Mailto (report)

## 📁 Folder Structure
Nyaya setu 
├── index.html          # App shell
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker
├── css/                # Modular CSS
│   ├── base.css        # Reset, splash, ripple
│   ├── theme.css       # Home + Reader themes
│   ├── layout.css      # Topbar, home, lists
│   ├── reader.css      # Reading view
│   └── components.css  # Buttons, modal, toast, settings
├── js/                 # Vanilla JS modules
│   ├── app.js          # Main controller + router
│   ├── router.js       # Hash-based routing
│   ├── storage.js      # LocalStorage wrapper
│   ├── search.js       # Debounced search + indexing
│   ├── bookmark.js     # Bookmark + last-read
│   ├── reader.js       # Reader view + toolbar
│   ├── speech.js       # TTS wrapper
│   ├── settings.js     # Settings view
│   ├── theme.js        # Theme application
│   └── utils.js        # Helpers, icons, toast, modal
└── data/               # JSON content
    ├── constitution.json
    ├── bns.json
    ├── bnss.json
    ├── bsa.json
    ├── ipc.json
    └── crpc.json1


## 📝 JSON Schema

Every law file follows the same schema:


{
  "meta": { "law": "bns", "title": "ভাৰতীয় ন্যায় সংহিতা", "version": "1.0" },
  "items": [
    {
      "id": "bns-103",
      "type": "section",
      "number": "Section 103",
      "title": "হত্যা (Murder)",
      "content": "Plain text (searchable)",
      "html": "<p>Formatted <strong>HTML</strong> for reader</p>"
    }
  ]
}


firebase is disabled by default. When ready to enable OTA content updates:Add firebase-app.js + firebase-firestore.js to js/firebase.jsCreate data/version.json with content versionOn app start, compare local vs remote versionIf newer → download updated JSON to IndexedDB, fall back to bundled JSONKeep UI code unchanged — only data source changes🎨 DesignHome: Deep charcoal + gold/amber accent, Ashoka emblem, premium cardsReader: Eye-comfort paper-like backgrounds, justified Assamese textTypography: System Assamese fonts (Noto Sans Bengali, Lohit Assamese, Vrinda)Icons: Pure inline SVG, no external libraryAnimations: 100–250ms, subtle, never flashy♿ AccessibilitySemantic HTML, ARIA labels on icon buttonsFocus-visible outlinesKeyboard navigableScreen-reader friendlyAdjustable font size & line heightHigh contrast reader themes📄 LicenseMIT © 2026 NyaySetu🤝 ContributingFork the repoAdd/update content in data/*.json (follow the schema)Test offline behaviorOpen a PRN
