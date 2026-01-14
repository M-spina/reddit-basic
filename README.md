# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# 🔥 Reddit Basic

A modern, responsive Reddit client built with React, Redux Toolkit, and Vite. Browse subreddits, read posts, view comments, and switch between light and dark modes.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://my-reddit-basics.netlify.app)
[![GitHub](https://img.shields.io/badge/github-repo-blue)](https://github.com/YOUR_USERNAME/reddit-basic)

![Reddit Basic Screenshot](./public/ScreenShots/LightMode/Screenshot%202026-01-14%20at%2003.31.50.png)

---

## 📋 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API & Data Caching](#api--data-caching)
- [Future Enhancements](#future-enhancements)
- [Screenshots](#screenshots)
- [License](#license)

---

## ✨ Features

### Core Functionality
- 🔍 **Search Subreddits** - Search and browse any public subreddit
- 📱 **Category Filters** - Quick access to popular categories (JavaScript, ReactJS, WebDev, etc.)
- 💬 **Comment Threads** - View nested comments with proper indentation
- 🔄 **Real-time Updates** - Fetches latest posts from Reddit's JSON API

### User Experience
- 🌓 **Dark Mode** - Toggle between light and dark themes with persistent preference
- 📱 **Responsive Design** - Optimized for mobile, tablet, and desktop
- ⚡ **Loading Skeletons** - Smooth loading states with animated skeletons
- ⚠️ **Error Handling** - User-friendly error messages with retry functionality
- 💾 **Smart Caching** - 5-minute cache to reduce API calls and avoid rate limits

### Performance & Optimization
- 🚀 **Fast Load Times** - Built with Vite for lightning-fast development and production builds
- 📦 **Code Splitting** - Optimized bundle size with lazy loading
- 🎯 **Rate Limit Protection** - Intelligent caching prevents hitting Reddit's API limits
- ♿ **Accessibility** - ARIA labels and keyboard navigation support

---

## 🛠️ Technologies Used

### Frontend
- **[React](https://react.dev/)** (18.3.1) - UI library for building component-based interfaces
- **[Redux Toolkit](https://redux-toolkit.js.org/)** (2.5.0) - State management with modern Redux patterns
- **[React Router](https://reactrouter.com/)** (7.1.1) - Client-side routing for navigation
- **[Vite](https://vite.dev/)** (6.0.5) - Next-generation frontend build tool

### Styling
- **CSS Variables** - Dynamic theming for light/dark mode
- **BEM Methodology** - Block-Element-Modifier naming convention for maintainable CSS
- **Responsive Design** - Mobile-first approach with media queries

### API
- **[Reddit JSON API](https://www.reddit.com/dev/api/)** - Public API for fetching posts and comments
- **Native Fetch API** - Modern, promise-based HTTP requests

### Development Tools
- **ESLint** - Code linting and quality checks
- **Git & GitHub** - Version control and collaboration
- **Netlify** - Continuous deployment and hosting

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/reddit-basic.git
   cd reddit-basic
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

---

## 📁 Project Structure

```
reddit-basic/
├── public/
│   └── ScreenShots
│         ├── DarkMode          #Screen-shots of website in dark mode
│         ├── LightMode         #Screen-shots of website in Light mode
│         └── MobileView        #Screen-shots of website in mobile view 
├── src/
│   ├── app/
│   │   └── store.js            # Redux store configuration
│   ├── components/
│   │   ├── Header.jsx          # App header with navigation
│   │   ├── SearchBar.jsx       # Subreddit search component
│   │   ├── CategoryFilter.jsx  # Category filter buttons
│   │   ├── Loader.jsx          # Loading spinner component
│   │   └── ThemeToggle.jsx     # Dark mode toggle button
│   ├── features/
│   │   ├── posts/
│   │   │   ├── postsSlice.js   # Posts Redux slice
│   │   │   ├── postsAPI.js     # Reddit posts API calls
│   │   │   ├── PostsList.jsx   # Posts list container
│   │   │   ├── PostCard.jsx    # Individual post card
│   │   │   └── PostsSkeleton.jsx # Loading skeleton
│   │   ├── comments/
│   │   │   ├── commentsSlice.js # Comments Redux slice
│   │   │   ├── commentsAPI.js   # Reddit comments API calls
│   │   │   ├── CommentsList.jsx # Comments list container
│   │   │   └── Comment.jsx      # Individual comment
│   │   ├── theme/
│   │   │   └── themeSlice.js    # Theme Redux slice
│   │   └── ui/
│   │       ├── uiSlice.js       # UI state management
│   │       └── ErrorState.jsx   # Error display component
│   ├── pages/
│   │   ├── Home.jsx             # Home page
│   │   └── PostDetails.jsx      # Post detail page
│   ├── styles/
│   │   ├── variables.css        # CSS custom properties
│   │   ├── globals.css          # Global styles
│   │   └── [component].css      # Component-specific styles
│   ├── App.jsx                  # Root component
│   └── main.jsx                 # Entry point
├── index.html
├── vite.config.js               # Vite configuration
└── package.json
```

---

## 🔌 API & Data Caching

### Reddit JSON API

This app uses Reddit's public JSON API (no authentication required):

```javascript
// Fetch posts from a subreddit
https://www.reddit.com/r/{subreddit}.json

// Fetch comments for a post
https://www.reddit.com/r/{subreddit}/comments/{postId}.json
```

### Caching Strategy

- **Cache Duration**: 5 minutes
- **Storage**: In-memory Map object
- **Benefits**:
  - Reduces API calls by ~80%
  - Prevents rate limiting (60 requests/minute)
  - Faster load times for repeated visits
  - Stale cache fallback during rate limits

### Rate Limit Handling

- Detects HTTP 429 responses
- Falls back to stale cache if available
- Shows user-friendly error messages
- Provides retry functionality

---

## 🔮 Future Enhancements

### Features to Add
- [ ] **Post Sorting** - Sort by hot, new, top, rising
- [ ] **Time Filters** - Filter posts by hour, day, week, month, year
- [ ] **Share Functionality** - Share posts via Web Share API
- [ ] **Search Within Subreddit** - Filter posts by keywords
- [ ] **Upvote/Downvote Display** - Show vote ratio visualization

### Technical Improvements
- [ ] **TypeScript Migration** - Add type safety
- [ ] **Unit Tests** - Jest + React Testing Library
- [ ] **E2E Tests** - Playwright or Cypress
- [ ] **Image Optimization** - Lazy load images, WebP format
- [ ] **Accessibility Audit** - WCAG 2.1 AA compliance

### UI/UX Enhancements
- [ ] **Animations** - Framer Motion for smooth transitions
- [ ] **Themes** - Multiple color themes beyond light/dark
- [ ] **Custom Fonts** - Typography improvements
- [ ] **Keyboard Shortcuts** - Power user features
- [ ] **Settings Panel** - User preferences (posts per page, etc.)

---

## 📸 Screenshots

### Light Mode - Home Page
![Light Mode Home](./public/ScreenShots/LightMode/Screenshot%202026-01-14%20at%2003.31.14.png)

### Dark Mode - Post Details
![Dark Mode Details](./public/ScreenShots/DarkMode/Screenshot%202026-01-14%20at%2003.36.37.png)

### Mobile Responsive
![Mobile View](./public/ScreenShots/MobileView/Screenshot%202026-01-14%20at%2003.35.57.png)
![Mobile View](./public/ScreenShots/MobileView/Screenshot%202026-01-14%20at%2003.34.16.png)

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve Reddit Basic:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Your Name**

- GitHub: [Malcolm Spina](https://github.com/M-spina)
- LinkedIn: [Jonathan Malcolm Spina Arenas](https://www.linkedin.com/in/jonathan-malcolm-spina-arenas-226552162)

---

## 🙏 Acknowledgments

- [Reddit](https://www.reddit.com/) for providing the JSON API
- [Vite](https://vite.dev/) for the amazing build tool
- [Redux Toolkit](https://redux-toolkit.js.org/) for simplified state management
- [Netlify](https://www.netlify.com/) for free hosting and deployment

---

## 📊 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/YOUR_USERNAME/reddit-basic)
![GitHub last commit](https://img.shields.io/github/last-commit/YOUR_USERNAME/reddit-basic)
![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/reddit-basic?style=social)

---

**Built with ❤️ using React and Redux Toolkit**