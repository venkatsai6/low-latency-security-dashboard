# Enterprise Low-Latency Security Dashboard

A high-performance, synchronized video streaming dashboard built to simulate a cloud-managed physical security environment inspired by [Verkada Command](https://www.verkada.com/command/).

This project demonstrates advanced browser resource management, complex state synchronization across multiple media elements, and the utilization of hardware-accelerated Web APIs to handle real-time multimedia data, client-side edge processing, and massive timeline datasets.

## Key Features

### Dashboard & Navigation

* **Verkada-Style Sidebar:** Collapsible navigation with organized sections for Video Security (Cameras, Grids, Favorites) and Organization (Sites, Settings).
* **Dark/Light Mode:** System-wide theme toggle with persistent preference storage.
* **Responsive Grid Layouts:** Switch between 1x1, 2x2, 3x3, and 4x4 camera grid views.

### Camera Management

* **All Cameras View:** Browse all connected cameras with live status indicators.
* **Saved Grids:** Create, name, and save custom camera grid configurations for quick access.
* **Favorites:** Star any camera to add it to your favorites for quick monitoring.
* **Sites:** Cameras organized by physical location (Headquarters, Warehouse, Retail Store).

### Video Streaming

* **Sub-Second Synchronization:** Utilizes delta-time calculations and a centralized Zustand store to keep up to 16 simultaneous HLS video streams perfectly synced without lagging the React render cycle.
* **High-Performance History Player:** Bypasses DOM layout limits by rendering a continuous 24-hour virtualized timeline entirely on a `<canvas>`. Uses native pointer math to scrub massive datasets at 60 FPS.
* **Lazy Streaming (Intersection Observer):** Intelligently manages network and RAM by pausing network requests (`hls.stopLoad()`) when camera feeds scroll out of the viewport, instantly resyncing them upon return.
* **Hardware-Accelerated Snapshots:** Extracts raw pixel data directly from the GPU, allowing users to export instant, high-resolution evidence frames without backend processing.

### Edge AI Processing

* **Client-Side Privacy Blur:** Leverages `requestVideoFrameCallback` and the Canvas 2D API to intercept raw video frames directly from the GPU render pipeline. Applies hardware-accelerated privacy blur to simulate real-time ML object tracking.
* **Processing Telemetry:** Real-time FPS and render time metrics displayed during analysis.

### Audio Enhancement

* **Vocal Clarity Equalization:** Custom Web Audio API routing graph using `BiquadFilterNode` and `GainNode` to filter low-frequency background noise and boost human speech presence.

### Settings & Persistence

* **Configurable Preferences:** Toggle auto-play, low latency mode, camera labels, and default grid layout.
* **Persistent Storage:** Favorites, saved grids, theme preference, and settings persist across browser sessions.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19, Vite, TypeScript (Strict Mode) |
| State Management | Zustand (with persist middleware) |
| Video Engine | HLS.js (low-latency configuration) |
| Styling | Tailwind CSS v4, Lucide React Icons |
| Fonts | Inter (UI), JetBrains Mono (monospace) |

### Browser APIs Utilized

* `Canvas API` — Pixel manipulation, edge ML processing, high-performance timeline rendering
* `requestVideoFrameCallback` — GPU render pipeline hooking
* `Web Audio API` — Signal routing and equalization
* `IntersectionObserver` — Memory and network optimization
* `HTMLMediaElement` — Native buffering state management
* `Pointer Events` — High-precision drag/scrub interactions

## Architecture

All complex business logic is decoupled from the presentation layer using custom hooks and specialized components:

| Module | Purpose |
|--------|---------|
| `useDashboardStore` | Centralized state for cameras, grids, favorites, sites, settings, and playback sync |
| `useHlsStream` | HLS worker thread initialization, lifecycle, and safe destruction |
| `useEdgeProcessor` | High-performance frame extraction loop with hardware-accelerated filters |
| `useMediaEvents` | Native DOM event hooks for localized buffering feedback |
| `useSnapshot` | In-memory canvas contexts for cross-origin image extraction |
| `useAudioEnhancer` | Multi-node audio equalization graph management |
| `useVisibility` | Intersection Observer for lazy stream loading |
| `TimelineScrubber` | Canvas-based 24-hour timeline without DOM bloat |

## Getting Started

### Prerequisites

* Node.js v18+
* npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173/low-latency-security-dashboard](http://localhost:5173/low-latency-security-dashboard) in your browser.

## Project Structure

```
src/
├── components/
│   ├── AiAnalysisModal.tsx   # Edge AI processing modal
│   ├── FavoritesView.tsx     # Favorited cameras view
│   ├── GridsView.tsx         # Saved grids management
│   ├── SettingsView.tsx      # App settings panel
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── SitesView.tsx         # Site-based camera grouping
│   ├── TimelineScrubber.tsx  # Canvas timeline component
│   └── VideoFeed.tsx         # Individual camera feed
├── hooks/                    # Custom React hooks
├── store/
│   └── useDashboardStore.ts  # Zustand state management
└── App.tsx                   # Main application layout
```

## Future Enhancements

* **WebCodecs & WASM Integration:** Replace Canvas 2D frame extraction with WebCodecs API and WebAssembly for decoding raw MP4/H.265 streams at the byte level.
* **Virtualization:** Implement windowing (e.g., react-window) for rendering 50+ camera nodes simultaneously.
* **WebRTC Fallback:** Add WebRTC signaling for true sub-100ms latency real-time communication.
* **Motion Detection Alerts:** Client-side motion detection with configurable sensitivity zones.
* **Export & Reporting:** Generate PDF reports and video clips for incident documentation.

## License

MIT