# Digital Night Sky Observatory

A lightweight, real-time **astronomical dashboard** built using pure **HTML, CSS, and JavaScript**, designed to simulate the dynamic nature of the night sky based on time-dependent logic.
This project focuses on **temporal simulation**, **live UI updates**, and **clean visual design**, rather than static content rendering.

---

##  Project Motivation

Astronomical data is never static—it changes continuously based on **time**, **observer position**, and **Earth’s rotation**.
This project was built to explore how **time-aware logic** and **real-time updates** can be visualized on the web using only core frontend technologies.

The result is a **digital observatory** that mimics professional astronomy dashboards in a simplified, browser-friendly form.

---

## Architecture & Development Approach

### 1️ Data Modeling

Celestial bodies are represented as structured JavaScript objects, covering multiple categories:

* Artificial Satellite
* Planet
* Star
* Comet

Each object includes attributes such as:

* Apparent Magnitude
* Altitude / Azimuth
* Visibility conditions
* Constellation (where applicable)

This demonstrates how heterogeneous scientific data can be handled cleanly in a frontend system.

---

### 2️ Temporal Simulation Engine

The system uses the JavaScript `Date()` API to determine the current sky state.

**Core logic:**

* Objects are visible only between **18:00 (6 PM)** and **06:00 (6 AM)**.
* Certain bodies (e.g., Polaris) remain permanently visible to reflect real astronomical behavior.
* Visibility dynamically updates as time changes—no page reload required.

This simulates Earth’s rotation and observer-based sky changes.

---

### 3️ Real-Time Updates

A `setInterval()` loop runs every **1000 milliseconds**, acting as a heartbeat for the system:

* Apparent Magnitude fluctuates slightly
* Altitude and azimuth values shift
* Visibility indicators update instantly

This creates the illusion of **live observational data**, similar to professional tracking tools.

---

### 4️ UI / UX Philosophy

The interface follows a **Glassmorphism-inspired design**, optimized for clarity and futuristic aesthetics:

* Semi-transparent cards
* Blur effects for depth
* High-contrast data presentation
* Minimal distractions, maximum readability

The goal was not decoration—but **information-first design**.

---

##  Tech Stack

### Frontend & Styling

* **HTML5** – Semantic structure and accessibility
* **TailwindCSS (via CDN)** – Utility-first styling, responsive layouts, and glass-card effects
* **CSS Keyframes** – Custom animations for:

  * Twinkling star background
  * Pulsing visibility indicators

---

### JavaScript (Core Logic Engine)

* **Temporal Logic** – Determines object visibility based on system time
* **Randomization Algorithms** – Uses `Math.random()` to simulate real-world data noise
* **DOM Manipulation** – Dynamic HTML generation to keep UI synced with data state

No frameworks. No abstractions. Just raw logic.

---

### Icons & Typography

* **Lucide Icons** – Lightweight, consistent iconography for celestial categories
* **Google Fonts**

  * **Space Grotesk** – Futuristic, technical headings
  * **Inter** – High readability for data-heavy content

---

##  Project Structure

```plaintext
/
├── index.html    # Main UI layout
├── style.css     # Custom animations and visual enhancements
├── script.js     # Temporal logic, simulation engine, DOM updates
└── README.md     # Project documentation
```

Simple structure. Easy to understand. Easy to extend.

---

## Key Features & Capabilities

*  Time-based visibility simulation
*  Live data updates every second
*  Predictive logic for permanent celestial bodies
*  Real-time DOM synchronization
*  Modern, glassmorphic UI design
*  Simulated irregular scientific data behavior

---

## Future Enhancements (Optional)

* Observer location (latitude/longitude) support
* Real astronomical APIs integration
* Day/Night sky transition animations
* Modular data source separation
* Conversion into a React/Vue component

---
