# 🔥 Reddit Basic

A responsive Reddit client built with React, Redux Toolkit, and Vite. Browse public subreddits, open post details directly, read nested comments, and switch between light and dark themes.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://my-reddit-basics.netlify.app)
[![GitHub](https://img.shields.io/badge/github-repo-blue)](https://github.com/M-spina/reddit-basic)

![Reddit Basic Screenshot](./public/ScreenShots/LightMode/Screenshot%202026-01-14%20at%2003.31.50.png)

---

## 📋 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [API and Data Caching](#api-and-data-caching)
- [Limitations](#limitations)
- [Future Enhancements](#future-enhancements)
- [Screenshots](#screenshots)
- [License](#license)

---

## ✨ Features

### Core Functionality

- 🔍 **Subreddit Search** — Browse public subreddits by name.
- 📱 **Category Filters** — Jump to Popular, JavaScript, ReactJS, WebDev, Programming, or Technology.
- 🔗 **Direct Post Details** — Open or refresh a `/post/:id` URL without first loading the home feed.
- 📝 **Post Content** — Read self-text, view full direct images, and follow outbound or Reddit permalink links.
- 💬 **Nested Comments** — Read flattened comment threads with their original order and indentation depth.

### User Experience

- 🌓 **Persistent Theme** — Save a light or dark preference in `localStorage`, with system preference as the fallback.
- 📱 **Responsive Layout** — Adapt the interface for mobile, tablet, and desktop widths.
- ⚡ **Loading Feedback** — Show skeletons for post listings and a loader for direct post navigation.
- ⚠️ **Error Recovery** — Display API errors and retry failed post-list or post-detail requests.
- 💾 **Short-Lived Caching** — Reuse successful requests for five minutes within the current browser tab.

### Accessibility Baseline

The interface uses native links, buttons, and form controls, including a labeled theme-toggle button and descriptive image alternative text. These controls inherit standard browser keyboard behavior. The project has not undergone a formal accessibility audit or WCAG conformance review.

---

## 🛠️ Technologies Used

### Frontend

- **[React](https://react.dev/)** (19.2) — Component-based UI.
- **[Redux Toolkit](https://redux-toolkit.js.org/)** (2.11) — Posts, comments, and theme state.
- **[React Router](https://reactrouter.com/)** (7.12) — Client-side home and post-detail routes.
- **[Vite](https://vite.dev/)** (7.2) — Development server and production build tool.

### Styling

- **CSS custom properties** — Theme-aware colours, spacing, radii, shadows, and transitions.
- **BEM-style class names** — Component-oriented CSS naming.
- **Media queries** — Mobile and tablet layouts.

### API

- **[Reddit JSON API](https://www.reddit.com/dev/api/)** — Unauthenticated public post and comment data.
- **Native Fetch API** — Browser requests and HTTP error handling.

### Testing and Tooling

- **Vitest and jsdom** — Unit and component test environment.
- **React Testing Library, jest-dom, and user-event** — User-focused component tests.
- **ESLint** — Static code checks.
- **Netlify** — Hosting, deploy previews, and the SPA route rewrite.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/M-spina/reddit-basic.git
   cd reddit-basic
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open the app**

   ```text
   http://localhost:5173
   ```

### Production Build

```bash
npm run build
npm run preview
```

Vite writes the optimized build to `dist`. Netlify copies `public/_redirects` into that build so History API routes such as `/post/:id` serve `index.html` on direct visits and refreshes.

---

## 🧪 Testing

Run the complete test suite once:

```bash
npm test
```

Run tests in watch mode during development:

```bash
npm run test:watch
```

The automated coverage includes:

- post-list and post-detail Redux request states;
- successful Reddit mapping plus 404, 429, and offline failures;
- subreddit search submission;
- saved-theme initialization, system fallback, toggling, and persistence;
- recursive comment ordering and depth;
- direct post navigation from an empty store, retry recovery, and self-text, image, and link rendering;
- string-based error display and rate-limit-specific retry feedback.

Use `npm run lint` for static checks and `npm run build` to validate the production bundle.

---

## 📁 Project Structure

```text
reddit-basic/
├── public/
│   ├── _redirects                    # Netlify SPA rewrite
│   └── ScreenShots/
│       ├── DarkMode/
│       ├── LightMode/
│       └── MobileView/
├── src/
│   ├── app/
│   │   ├── rootReducer.js            # Redux reducer map
│   │   └── store.js                  # Redux store configuration
│   ├── components/
│   │   ├── CategoryFilter.jsx        # Preset subreddit buttons
│   │   ├── Header.jsx                # App header and navigation
│   │   ├── Loader.jsx                # Loading indicator
│   │   ├── SearchBar.jsx             # Subreddit search
│   │   └── ThemeToggle.jsx           # Dark mode toggle button
│   ├── features/
│   │   ├── comments/
│   │   │   ├── commentsAPI.js
│   │   │   ├── commentsAPI.test.js
│   │   │   ├── commentsSlice.js
│   │   │   ├── Comment.jsx
│   │   │   └── CommentsList.jsx
│   │   ├── posts/
│   │   │   ├── postsAPI.js
│   │   │   ├── postsAPI.test.js
│   │   │   ├── postsSlice.js
│   │   │   ├── postsSlice.test.js
│   │   │   ├── PostCard.jsx
│   │   │   ├── PostsList.jsx
│   │   │   └── PostsSkeleton.jsx
│   │   └── ui/
│   │       ├── ErrorState.jsx
│   │       └── ErrorState.test.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── PostDetails.jsx
│   │   └── PostDetails.test.jsx
│   ├── styles/                       # Global and component CSS
│   ├── test/
│   │   └── setup.js                  # Shared jest-dom setup
│   ├── App.jsx                       # Route definitions
│   └── main.jsx                      # Browser entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## 🔌 API and Data Caching

### Reddit JSON Endpoints

The app reads Reddit's public JSON endpoints without OAuth:

```text
# Subreddit listing
https://www.reddit.com/r/{subreddit}.json?raw_json=1

# One post by ID for direct navigation
https://www.reddit.com/comments/{postId}.json?raw_json=1&limit=1

# Comments for a recovered post and subreddit
https://www.reddit.com/r/{subreddit}/comments/{postId}.json
```

If a post already exists in the listing state, the detail page uses it immediately. Otherwise it fetches the post by ID, verifies that the response still belongs to the active route, and then requests comments using the recovered subreddit.

Self-text preserves line breaks. Direct-image posts use their full URL, ordinary link posts expose the outbound destination, and every post with a permalink provides a **View on Reddit** link. Gallery and video content links back to Reddit rather than being embedded.

### Caching Strategy

- Listing responses are cached by subreddit.
- Direct-detail responses are cached by post ID.
- Comment responses are cached by subreddit and post ID.
- Each cache entry is considered fresh for five minutes.
- The caches are in-memory JavaScript `Map` objects scoped to the current browser tab.
- A full page refresh, closed tab, or new tab starts with empty caches.
- When Reddit returns HTTP 429 and an older cache entry exists, the app can return that stale entry instead of failing the request.

### Error Handling

The API layer reports missing subreddits or posts, private or restricted content, rate limits, other failed HTTP responses, and offline requests. The interface renders the resulting message and offers a retry action where appropriate.

---

## ⚠️ Limitations

- Reddit's unauthenticated JSON endpoints are outside this project's control and may return HTTP 403, 404, or 429 responses.
- Private, quarantined, age-restricted, removed, or otherwise restricted communities and posts may be unavailable.
- Browser privacy settings, network policy, or Reddit's cross-origin controls may cause a request to fail before an HTTP response is exposed.
- The five-minute cache reduces repeated requests but does not guarantee protection from rate limits.
- Caches are not persisted across refreshes or shared between tabs.
- Galleries and videos are linked to Reddit rather than embedded.
- The client is read-only: it does not authenticate, vote, post, or save Reddit content.

---

## 🔮 Future Enhancements

### Features

- [ ] Post sorting by hot, new, top, or rising.
- [ ] Time filters for top listings.
- [ ] Share support through the Web Share API.
- [ ] Keyword filtering within a loaded subreddit.
- [ ] Vote-ratio visualization.

### Technical Improvements

- [ ] TypeScript migration.
- [ ] End-to-end browser coverage with Playwright or Cypress.
- [ ] A formal accessibility audit and follow-up fixes.
- [ ] Persistent or service-worker-backed caching.

### UI and UX

- [ ] Evaluate Framer Motion for optional future transitions.
- [ ] Additional colour themes.
- [ ] Typography improvements.
- [ ] Keyboard shortcuts.
- [ ] A user settings panel.

---

## 📸 Screenshots

### Light Mode — Home Page

![Light Mode Home](./public/ScreenShots/LightMode/Screenshot%202026-01-14%20at%2003.31.14.png)

### Dark Mode — Post Details

![Dark Mode Details](./public/ScreenShots/DarkMode/Screenshot%202026-01-14%20at%2003.36.37.png)

### Mobile Responsive

![Mobile View](./public/ScreenShots/MobileView/Screenshot%202026-01-14%20at%2003.35.57.png)
![Mobile View](./public/ScreenShots/MobileView/Screenshot%202026-01-14%20at%2003.34.16.png)

---

## 🤝 Contributing

Contributions are welcome:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/amazing-feature`.
3. Commit the change: `git commit -m 'Add amazing feature'`.
4. Push the branch: `git push origin feature/amazing-feature`.
5. Open a pull request.

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

- [Reddit](https://www.reddit.com/) for providing the JSON API.
- [Vite](https://vite.dev/) for the build tooling.
- [Redux Toolkit](https://redux-toolkit.js.org/) for state management.
- [Netlify](https://www.netlify.com/) for hosting and deploy previews.

---

## 📊 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/M-spina/reddit-basic)
![GitHub last commit](https://img.shields.io/github/last-commit/M-spina/reddit-basic)
![GitHub stars](https://img.shields.io/github/stars/M-spina/reddit-basic?style=social)

---

**Built with ❤️ using React and Redux Toolkit**
