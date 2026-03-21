# Enterprise Low-Latency Security Dashboard

A high-performance, synchronized video streaming dashboard built to simulate a cloud-managed physical security environment.

This project demonstrates advanced browser resource management, complex state synchronization across multiple media elements, and the utilization of hardware-accelerated Web APIs to handle real-time multimedia data efficiently.

## Key Features

* **Sub-Second Synchronization:** Utilizes delta-time calculations and a centralized Zustand store to keep up to 9 simultaneous HLS video streams perfectly synced without lagging the React render cycle.
* **Lazy Streaming (Intersection Observer):** Intelligently manages network and RAM by actively pausing network requests (`hls.stopLoad()`) when camera feeds scroll out of the viewport, and instantly resyncing them upon waking up.
* **Hardware-Accelerated Snapshots:** Leverages the native HTML5 `<canvas>` API to extract raw pixel data directly from the GPU, allowing users to export instant, high-resolution evidence frames without backend processing.
* **Vocal Clarity Equalization:** Implements a custom Web Audio API routing graph (using `BiquadFilterNode` and `GainNode`) to filter out low-frequency background rumble (wind/server hum) and boost the presence of human speech safely without digital clipping.

## Tech Stack & APIs

* **Core:** React (Vite), TypeScript (Strict Mode)
* **State Management:** Zustand
* **Video Engine:** HLS.js (Configured for low-latency and strict buffer limits)
* **Styling:** Tailwind CSS, Lucide Icons
* **Browser APIs Utilized:**
  * `IntersectionObserver` (Memory & Network Management)
  * `Canvas API` (Pixel Manipulation)
  * `Web Audio API` (Signal Routing & Equalization)
  * `HTMLMediaElement` Native Events (Buffering State Management)

## Architecture & Design Decisions

To ensure scalability and maintainability, all complex business logic is strictly decoupled from the presentation layer using custom, strongly-typed React Hooks:

* `useHlsStream`: Manages the initialization, lifecycle, and safe destruction of the HLS worker threads.
* `useMediaEvents`: Hooks into native DOM events (`waiting`, `canplay`) to provide accurate, localized buffering feedback without triggering global re-renders.
* `useVisibility`: Tracks element viewport intersection to trigger sleep/wake states.
* `useSnapshot`: Creates in-memory canvas contexts to safely handle cross-origin image extraction.
* `useAudioEnhancer`: Builds and safely toggles a multi-node audio equalization graph.

## Getting Started

### Prerequisites

* Node.js (v18+ recommended)
* npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
3. Run the Server

   ```bash
   npm run dev
4. Open <http://localhost:5174/> in your browser.
