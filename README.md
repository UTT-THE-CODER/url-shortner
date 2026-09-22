# Shortly — URL Shortener

A full-stack URL shortener built with React and Node.js.

Shorten long URLs into compact links, track clicks, copy shortened URLs instantly, and protect the API with a custom sliding-window rate limiter.

## 🚀 Features

- 🔗 Shorten long URLs
- ⚡ Base62 short code generation
- 📊 Track URL click counts
- 📋 Copy shortened URLs to clipboard
- 🛡️ Custom sliding-window rate limiter
- 🚫 10 URL creations per minute per IP
- ⏳ `Retry-After` header when rate limit is exceeded
- 🔄 HTTP 302 redirects
- 📱 Responsive modern UI
- 💾 In-memory storage — no database required
- ⚛️ React frontend
- 🟢 Node.js + Express backend

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS
- Lucide React

### Backend

- Node.js
- Express.js

### Storage

- JavaScript `Map`
- No database

## 📁 Project Structure

```text
url-shortener/
│
├── server.js
├── package.json
│
└── client/
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    │
    ├── public/
    ├── package.json
    └── vite.config.js
