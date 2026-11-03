# K-Explore Events — Responsive Event Management Website

> A modern, visually stunning, fully responsive event management platform built for the **K Explore – Web Designing** task.

![K-Explore Preview](https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80)

---

## 🚀 Live Demo & Deployment

- **Live Deployed Website (Vercel)**: **[https://web-design-project-tau.vercel.app/](https://web-design-project-tau.vercel.app/)**
- **GitHub Repository**: **[https://github.com/archie1138/web-design-project](https://github.com/archie1138/web-design-project)**

---

## 📌 Project Overview

This website provides an interactive, accessible, and high-performance event discovery and registration experience. Users can browse upcoming conferences, summits, and festivals, view detailed schedules and speakers, and seamlessly register with instant client-side validation and digital ticket generation.

---

## 🌟 Key Features (Fulfilling All Requirements)

### 1. 🎨 Modern UI/UX & Responsive Layout
- Fully responsive across **Mobile phones (320px+)**, **Tablets**, and **Desktop** screens.
- Clean typography featuring Google Font **Plus Jakarta Sans**, glassmorphism headers, smooth elevation cards, and accessible color contrast.

### 2. ⚡ Hero Section & Social Proof
- Eye-catching hero banner with glowing gradient accents, headline, value proposition, and quick CTA buttons.
- Real-time social metrics counter (**50+ Events**, **14K+ Attendees**, **99.4% Positive Feedback**, **100% Verified Passes**).

### 3. 🔍 Interactive Search, Category Filters & Sorting
- **Real-Time Search**: Filters events instantly by title, tech stack keywords, city, or venue.
- **Category Filter Pills**: Filter across *All, Tech & AI, Music & Arts, Business & Startups, Workshops, Gaming & Esports, Sports & Fitness*.
- **Multi-criteria Sorting**: Sort by date (soonest first / later), alphabetical title, or available seats.
- **Empty State Feedback**: Friendly fallback UI when no events match the search query with a one-click reset.

### 4. 📋 Rich Event Details Modal
- Modal dialog showcasing event banners, venue address, ticket price, and comprehensive description.
- **Speaker & Mentor Profiles**: Photos, names, roles, and company affiliations.
- **Interactive Agenda & Timeline**: Step-by-step breakdown of session timings.
- Live ticking countdown timer banner.

### 5. 🛡️ Robust JavaScript Form Validation
- **Client-Side Validation** preventing invalid submissions with real-time feedback:
  - **Participant Full Name**: Must be at least 3 characters and contain valid alphabets.
  - **Email Address**: Standard RFC email format check (`name@domain.com`).
  - **Phone Number**: Validates 10-digit mobile number format.
  - **Selected Event & Pass Category**: Dropdown validation with automatic capacity tracking.
  - **Terms & Conduct Agreement**: Checkbox verification.
- Accessible error states with red highlight, helper hints, and green success states.

### 6. 🎫 Digital Ticket Pass & QR Code
- Upon registration submission, celebration **Confetti** launches on screen!
- Generates a sleek, authentic boarding-pass style **Digital Event Pass**:
  - Unique Booking Reference ID (e.g. `TKT-4X9A1B`).
  - Attendee Name, Event Name, Date, Time, Venue, and Pass Type.
  - Procedurally generated Canvas **QR Code** for entry scanning.
  - Built-in **Print / Save as PDF** styling (`@media print` cleanly formats ticket only).

---

## 🏆 Bonus Challenges Implemented

| Bonus Challenge | Implementation Details |
| :--- | :--- |
| **🌓 Dark / Light Mode** | Custom CSS Variables palette. Includes OS `prefers-color-scheme` auto-detection and persistent theme storage in `localStorage`. Smooth transitions on icons and surfaces. |
| **⏳ Live Countdown Timers** | JavaScript `setInterval` engine dynamically computing Days, Hours, Minutes, and Seconds remaining for every event card and detail modal. |
| **✨ Animations & Micro-Interactions** | Dynamic Canvas-based Confetti celebration upon registration, smooth card lift on hover, image zooms, modal fade/scale transitions, and animated toast notifications. |
| **💾 LocalStorage Registration Management** | Dedicated **"My Tickets"** drawer: view all active registrations, access boarding passes anytime, or cancel a registration (which restores available seats back to the event pool). |

---

## 📁 Project Architecture & File Structure

```
k-explore-events/
├── index.html                  # Semantic HTML5 structure & accessible dialogs
├── css/
│   └── styles.css              # Custom CSS variables, responsive grid, glassmorphism, dark mode & print rules
├── js/
│   ├── events-data.js          # Mock event catalog with dynamic future dates, speakers, and agendas
│   ├── validation.js           # Form validation rules, error injection, and accessibility handlers
│   ├── storage.js              # LocalStorage manager for bookings, seat counts, and theme preferences
│   └── app.js                  # Main controller: renderers, search/filter, countdown engine, confetti & modals
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated CI/CD GitHub Actions workflow for GitHub Pages
└── README.md                   # Comprehensive project documentation
```

---

## 💻 How to Run Locally

Because the project is written in standards-compliant modern HTML5, CSS3, and ES6 JavaScript, **no bulky dependencies, build steps, or `npm install` are required**!

### Method 1: Using Node / npx (Recommended for ES Modules)
```bash
# Navigate to project folder
cd k-explore-events

# Serve with any static web server
npx serve .
# or
python -m http.server 8000
```
Open `http://localhost:3000` (or `http://localhost:8000`) in your browser.

### Method 2: VS Code Live Server
Right-click `index.html` in VS Code and choose **"Open with Live Server"**.

---

## 🌐 How to Deploy

### Option 1: GitHub Pages (Automatic via Included Workflow)
1. Initialize git and push to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit for K-Explore Events platform"
   git branch -M main
   git remote add origin https://github.com/archie1138/web-design-project.git
   git push -u origin main
   ```
2. In your GitHub repository:
   - Navigate to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, choose **GitHub Actions**.
   - The included `.github/workflows/deploy.yml` will automatically build and publish your website!

### Option 2: Vercel (1-Click Deployment)
1. Go to [vercel.com](https://vercel.com).
2. Click **Add New Project** > **Import Git Repository**.
3. Select your `k-explore-events` repository and click **Deploy**. Vercel will instantly publish the static site.

### Option 3: Netlify
1. Go to [app.netlify.com](https://app.netlify.com).
2. Drag and drop the `k-explore-events` folder into the Netlify dashboard, or connect your GitHub repository for continuous deployment.

---

## 🧪 Evaluation Rubric Compliance

- **Creativity**: Interactive boarding-pass ticketing with QR code, confetti burst, and live ticking timers.
- **UI/UX**: Aesthetic color palette, high contrast, smooth transitions, mobile hamburger drawer, and glassmorphism.
- **Functionality**: Live search, category filtering, multi-sort, robust form validation, and storage persistence.
- **Responsiveness**: Fluid layout using CSS Grid, Flexbox, and media queries across mobile, tablet, and desktop.
- **Code Quality**: Clean modular ES6 code separated into data, storage, validation, and presentation layers.
- **Documentation**: Detailed README with setup, architecture, and deployment guidelines.

---

&copy; 2026 **K-Explore Events** — Designed and Developed for the K Explore Web Designing Challenge.

