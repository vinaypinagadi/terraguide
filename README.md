# 🌿 TerraGuide - Personal Carbon Footprint Tracker

TerraGuide is a lightweight, fully client-side digital platform designed to empower individuals to understand, track, and reduce their personal carbon footprint through personalized insights, progress metrics, and actionable steps.

Built for privacy, performance, and offline-first usage, the entire compiled application is **under 1 MB** in final build size, loading instantly and running completely serverless in any browser.

---

## 🌟 Key Features

1. **Smart Carbon Calculator**  
   A step-by-step onboarding wizard covering Home Utilities, Transport & Commute, Diet, and Shopping. Features immediate real-time feedback with responsive sliders and option cards.
   
2. **Interactive Dashboard**  
   Visualizes your carbon footprint breakdown and benchmarks it against European, US, and Global averages, alongside the Climate Safe Target (<2,000 kg CO2e/year).

3. **Personalized Recommendations**  
   Calculates tailored sustainability changes (such as car-free days, home insulation, or diet adjustments) based on your highest emitting sectors, and compiles them into a custom active roadmap planner.

4. **Daily Habits Tracker & Streaks**  
   Check off daily sustainable actions (like zero food waste, line-drying clothes, or taking short showers) to build a daily habit streak and unlock progress milestone badges.

5. **Future Scenario modeling**  
   Interactive "What-If" simulator that forecasts your footprint reduction based on hypothetical lifestyle upgrades (solar panel installations, meat-free days, transit switches).

6. **Backup Portability & Privacy**  
   Export profile data as a `.json` backup file or import previous settings. Reset all data locally at any time.

7. **One-Click PDF Export**  
   Custom print-media layouts styled specifically to generate high-contrast, clean PDF reports native to any browser printing dialog.

---

## 🛠️ Technology Stack (Optimized for size)

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router with fully static HTML export `output: 'export'`)
* **State Management & DB:** [Zustand](https://github.com/pmndrs/zustand) with built-in persistence to browser `localStorage`
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with native CSS keyframe loaders
* **Typography:** [Outfit Google Font](https://fonts.google.com/specimen/Outfit)
* **Icons:** [Lucide React](https://lucide.dev/) (tree-shaken)
* **Charts:** Native SVG-reactive chart renderers (0 KB footprint, avoiding heavy libraries like Recharts or Chart.js)

---

## 📁 Directory Structure

```
├── app/
│   ├── layout.tsx         # Root layout with Outfit typography
│   ├── page.tsx           # Home application frame and tab controller
│   └── globals.css        # Tailwind v4 directives, custom animations, print styles
├── components/
│   ├── Preloader.tsx      # Animated SVG sprout breathing preloader
│   ├── Calculator.tsx     # Onboarding carbon footprint questionnaire wizard
│   ├── Dashboard.tsx      # Core metrics summaries and sector callouts
│   ├── DashboardCharts.tsx# Custom SVG Donut, Comparison Bar, and Line charts
│   ├── Recommendations.tsx# Personal roadmap tip selectors and action checklists
│   ├── HabitTracker.tsx   # Streak fire counter, habits log, and milestone badges
│   ├── ScenarioModel.tsx  # Sliders for "What-If" lifestyle simulation
│   ├── Settings.tsx       # JSON data backup controllers and privacy reset
│   └── PrintReport.tsx    # Print-friendly stylesheet report visible only in window.print()
├── store/
│   └── useCarbonStore.ts  # Zustand store declaring state, actions, and local persistence
└── utils/
    ├── carbonCalculator.ts# CO2 coefficients, category multipliers, and formatting
    └── recommendations.ts # Rules engine for triggering and listing action tips
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 1. Install Dependencies

Clone the workspace and run:
```bash
npm install
```

### 2. Run the Development Server

Start the local server for development:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### 3. Build & Static Export

To compile TypeScript and export the project into static HTML/CSS/JS files:
```bash
npm run build
```
The compiled files will output to the `/out` directory.

### 4. Serve the Production Build

You can serve the static `/out` folder locally to verify production styling and offline loading:
```bash
npx serve out
```
Open the printed port (usually `http://localhost:3000` or `5000`) in your browser.

---

## 🔒 Privacy & Offline Performance

* **100% Client-Side:** No login required. No databases are accessed over the web, and no analytics or tracking scripts are embedded.
* **Serverless Execution:** Once loaded, the application is fully operational without an internet connection.
* **Storage Limit:** Since data is stored in your local browser `localStorage`, clearing your browser cookies/storage will reset the app unless you export a backup from the **Settings** tab.
