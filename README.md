# 🌊 BenthicSim Matrix

**ITM Skills University | B.Tech CSE 2025-29 | React JS | Semester II | Case Study 83**

---

## 👤 Student Details

| Field | Details |
|-------|---------|
| **Name** | Anant Dhoundiyal |
| **Roll No.** | 150096725170 |
| **Batch** | Sam Altman |
| **Course** | React JS — Semester II |
| **University** | ITM Skills University |

---

## 📌 Project Title

**BenthicSim Matrix — Deep-Sea Submarine Control Panel**

A simulated real-time control panel for a deep-sea submarine, tracking sensor statuses, logging safety commands, streaming sonar data, verifying pilot certifications, sorting missions, visualising acoustic relay networks, planning quiet navigation routes, and managing cold specimen storage.

---

## 🔗 Links

| | URL |
|--|-----|
| **GitHub Repository** | https://github.com/anantd16/BenthicSim-matrix |
| **Live Demo** | https://benthic-sim-matrix.vercel.app/ |

---

## 📋 Problem Statement

**Case Study 83 — BenthicSim Matrix**

Create a simulated control panel for a deep-sea submarine, showing the status of its sensors and logging its depth and movements underwater. The panel must implement 8 feature modules covering sensor monitoring, safety command management, sonar data streaming, pilot verification, mission ranking, acoustic communication mapping, quiet route planning, and specimen storage management.

---

## 🎯 Objectives

- Build a responsive, real-time submarine dashboard using **React JS functional components and hooks**
- Implement all 8 required feature modules as independent, reusable components
- Demonstrate core React concepts: `useState`, `useEffect`, `useRef`, `setInterval`, conditional rendering, and event handling
- Produce a dark-themed, monospace-style UI that evokes an authentic underwater control panel aesthetic
- Deploy as a live, publicly accessible web application

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **UI Framework** | React 18 (Vite) |
| **Language** | JavaScript (JSX) |
| **Styling** | Custom CSS (App.css) |
| **State Management** | React Hooks (`useState`, `useEffect`, `useRef`) |
| **Build Tool** | Vite |
| **Deployment** | Vercel |
| **Version Control** | Git / GitHub |

---

## 🏗️ System Overview / Component Architecture

The application is a single-page React app. `App.jsx` is the root, rendering a `dashboard-grid` that hosts 8 fully independent panel components:

```
App (root)
├── <SubSensorStatus />       — Module 1: Live sensor readings with auto-refresh
├── <SafetyActionUndo />      — Module 2: Command history log with undo/redo
├── <SonarDataFeed />         — Module 3: FIFO live sonar stream
├── <PilotIDChecker />        — Module 4: Pilot certification search
├── <MissionTimeSorter />     — Module 5: Sort missions by underwater hours
├── <UnderwaterCommsMap />    — Module 6: SVG acoustic relay node map
├── <QuietNavPlanner />       — Module 7: Noise-sorted waypoint route planner
└── <SampleStorageManager />  — Module 8: Cold storage grid manager
```

Each component manages its own local state independently — no prop drilling or global store required.

---

## ⚙️ Features / Implementation

### Module 1 — Sub Sensor Status
Tracks 5 live sensors: Pressure Sensor, Navigation Array, Hull Integrity, Thermal Scanner, and Gyroscope. Values are randomised every **2500ms** via `setInterval` in `useEffect`. Each sensor displays its current reading, a colour-coded status tag (`ONLINE` / `WARNING` / `OFFLINE`), and a proportional progress bar. Status thresholds: >65% = ONLINE (green), >30% = WARNING (amber), ≤30% = OFFLINE (red).

### Module 2 — Safety Action Undo
A command history log pre-seeded with 3 actions (blow ballast tank, buoyancy valve, depth stabiliser). Operators can log new actions via text input (Enter key or LOG button), toggle any action between `Undo`/`Redo` states, or remove entries permanently. State is managed as an array of action objects.

### Module 3 — Sonar Data Feed
Simulates a live underwater radar FIFO queue. A new ping is generated every **1800ms** from randomised object types and bearings. The feed keeps the last 10 entries, highlights the newest ping with a flash animation, and supports PAUSE/RESUME and CLEAR controls. Sequence numbers are tracked via `useRef` to survive re-renders without resetting.

### Module 4 — Pilot ID Checker
Searches a local clearance database of 4 pilots by ID (e.g. `PLT-001`) or partial name match. Displays full certification details: name, cert class, clearance status, and expiry date. Returns a NOT FOUND notice for unrecognised queries.

### Module 5 — Mission Time Sorter
Sorts 6 submarine missions by total underwater hours in ascending (LEAST HRS) or descending (MOST HRS) order. Toggle buttons switch the sort direction; ranks update instantly using `Array.sort()` on a copy of the state array.

### Module 6 — Underwater Comms Map
Renders 5 acoustic relay nodes (Alpha Buoy, Beta Ridge, Gamma Trench, Delta Base, Epsilon Node) on an SVG canvas with dashed connection lines between linked nodes. Clicking a node highlights it and shows its frequency and depth details below the map.

### Module 7 — Quiet Navigation Planner
Manages a list of route waypoints, each with a name and engine noise level in dB. Waypoints are always displayed sorted by ascending noise (quietest first) to minimise sensor interference. Colour-coded noise tags: green <20 dB, amber <35 dB, red ≥35 dB. Supports adding new waypoints and removing existing ones. Shows live average noise across the route.

### Module 8 — Sample Storage Manager
A 4×5 grid of 20 cold storage boxes for collected specimens. Pre-populated with 6 samples. Clicking a box selects it (highlighted border); the operator can then type a sample name and STORE it, or CLEAR the box. Displays fill count (n/20 occupied) in real time.

---

## 📸 Screenshots

### Screenshot 1 — Sub Sensor Status & Safety Action Undo

<img width="1400" height="841" alt="image" src="https://github.com/user-attachments/assets/aded4372-9603-48c8-b9c2-2b3b9ba41dc8" />


*Sub Sensor Status panel showing live readings (Pressure 95 bar, Hull Integrity at WARNING 87%), alongside the Safety Action Undo log with reversible commands.*

### Screenshot 2 — Sonar Data Feed, Pilot ID Checker, Mission Sorter & Comms Map

<img width="1405" height="840" alt="image" src="https://github.com/user-attachments/assets/4ebb2118-d1e1-409f-a76c-cb2a5e46a465" />


*Sonar Data Feed streaming LIVE pings, Pilot ID Checker input, Mission Time Sorter ranked by most hours, and the Underwater Comms Map SVG relay network.*

### Screenshot 3 — Quiet Navigation Planner & Sample Storage Manager

<img width="1400" height="846" alt="image" src="https://github.com/user-attachments/assets/43e5692e-b279-4c4c-a306-85e69e0e4b30" />


*Quiet Navigation Planner showing waypoints sorted by noise level (12–31 dB), and Sample Storage Manager grid with 6 occupied boxes.*

---

## 🚀 Setup & Execution Steps

### Prerequisites
- Node.js ≥ 18
- npm or yarn

### Install & Run Locally

```bash
# Clone the repository
git clone https://github.com/anantd16/BenthicSim-matrix.git
cd BenthicSim-matrix

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
```

### Deploy (Vercel)

```bash
npm install -g vercel
vercel
```

---

## 📊 React Concepts Demonstrated

| Concept | Where Used |
|---------|-----------|
| `useState` | All 8 components — local state management |
| `useEffect` + `setInterval` | SubSensorStatus (2500ms), SonarDataFeed (1800ms) |
| `useRef` | SonarDataFeed — sequence counter across renders |
| Conditional rendering | PilotIDChecker result, relay node details, storage selection |
| Array methods | `.sort()` MissionTimeSorter, `.filter()` SafetyAction, `.map()` all lists |
| Event handling | onClick, onChange, onKeyDown (Enter to submit) |
| SVG in JSX | UnderwaterCommsMap — relay nodes and dashed connection lines |
| Component composition | 8 independent panel components in a CSS grid layout |

---

## 📈 Results and Observations

1. All 8 modules function independently with no cross-component side effects.
2. Real-time updates (sensor refresh, sonar pings) work smoothly via `setInterval` + `useEffect` cleanup, preventing memory leaks.
3. `useRef` for the sonar sequence counter correctly persists across re-renders without triggering extra renders.
4. The CSS grid layout adapts the 8 panels into a clean 2-column dashboard at desktop viewport widths.
5. The dark monospace theme with colour-coded status indicators provides an authentic submarine control panel feel.

---

## 🏁 Conclusion

BenthicSim Matrix successfully implements all 8 required features of Case Study 83 as a fully functional React JS single-page application. The project demonstrates practical use of React hooks for real-time state updates, component composition, conditional rendering, and interactive SVG — deployed live on Vercel with a public GitHub repository.

---

*ITM Skills University | B.Tech CSE 2025-29 | React JS | Semester II*
