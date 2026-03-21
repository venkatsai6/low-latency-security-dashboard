# Enterprise Low-Latency Security Dashboard

A high-performance, synchronized video streaming dashboard built to simulate a cloud-managed physical security environment. 

This project demonstrates advanced browser resource management, complex state synchronization across multiple media elements, and the utilization of hardware-accelerated Web APIs to handle real-time multimedia data, client-side edge processing, and massive timeline datasets.

## Key Features

* **Sub-Second Synchronization:** Utilizes delta-time calculations and a centralized Zustand store to keep up to 9 simultaneous HLS video streams perfectly synced without lagging the React render cycle.
* **High-Performance History Player:** Bypasses DOM layout limits (reflow crashes) by rendering a continuous 24-hour virtualized timeline entirely on a `<canvas>`. Uses native pointer math to scrub massive datasets at a smooth 60 FPS.
* **Client-Side Edge AI Processing:** Leverages `requestVideoFrameCallback` and the Canvas 2D API to intercept raw video frames directly from the GPU render pipeline. Applies a hardware-accelerated privacy blur to simulate real-time ML object tracking without relying on expensive backend cloud processing.
* **Lazy Streaming (Intersection Observer):** Intelligently manages network and RAM by actively pausing network requests (`hls.stopLoad()`) when camera feeds scroll out of the viewport, instantly resyncing them upon waking up.
* **Hardware-Accelerated Snapshots:** Extracts raw pixel data directly from the GPU, allowing users to export instant, high-resolution evidence frames without backend processing.
* **Vocal Clarity Equalization:** Implements a custom Web Audio API routing graph (using `BiquadFilterNode` and `GainNode`) to filter out low-frequency background rumble and safely boost the presence of human speech.

## Tech Stack & APIs

* **Core:** React (Vite), TypeScript (Strict Mode)
* **State Management:** Zustand
* **Video Engine:** HLS.js (Configured for low-latency and strict buffer limits)
* **Styling:** Tailwind CSS, Lucide Icons
* **Browser APIs Utilized:**
  * `Canvas API` (Pixel Manipulation, Edge ML, & High-Performance UI Rendering)
  * `requestVideoFrameCallback` (GPU Render Pipeline Hooking)
  * `Web Audio API` (Signal Routing & Equalization)
  * `IntersectionObserver` (Memory & Network Management)
  * `HTMLMediaElement` Native Events (Buffering State Management)
  * `Pointer Events` (High-Precision Drag/Scrub Math)

## Architecture & Design Decisions

To ensure scalability and maintainability, all complex business logic is strictly decoupled from the presentation layer using custom, strongly-typed React Hooks and specialized components:

* `TimelineScrubber`: Prevents DOM bloat (which causes memory spikes) by mathematically calculating and painting thousands of timestamp ticks directly onto a single canvas element.
* `useEdgeProcessor`: Manages the high-performance frame extraction loop and paints hardware-accelerated telemetry/filters to the canvas.
* `useHlsStream`: Manages the initialization, lifecycle, and safe destruction of the HLS worker threads.
* `useMediaEvents`: Hooks into native DOM events to provide accurate, localized buffering feedback without triggering global re-renders.
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
   ```

3. Run the dev server

   ```bash
   npm run dev
   ```

4. Open http://localhost:5173/low-latency-security-dashboard in your browser.

### Future Enhancements

1. WebCodecs & WASM Integration: Fully replace the Canvas 2D frame extraction with the WebCodecs API and WebAssembly for decoding raw MP4/H.265 streams at the byte level.

2. Virtualization: Implement windowing (e.g., react-window) for the camera grid to support rendering 50+ camera nodes in the DOM simultaneously.

3. WebRTC Fallback: Add support for WebRTC signaling to achieve true sub-100ms latency for real-time intercom communication.