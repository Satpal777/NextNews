# 📰 NextNews — AI-Powered News Summarizer (Next.js and ShadCN)

NextNews is a modern Next.js web application that aggregates the latest headlines from NewsAPI and generates AI summaries for each article using models like **Llama-3.3-70B-Versatile** and **Groq** as the inference platform. 
It’s designed for speed, simplicity, and intelligence — bringing real-time **news + weather updates** together with **AI-powered insights** and a **sleek ShadCN UI**.

---

## 🚀 Features

| Feature | Status | Description |
|----------|---------|-------------|
| 🗞️ **Top Headlines** | ✅ Done | Fetches top headlines and live articles from **NewsAPI** |
| 🤖 **AI Summarization** | ✅ Done | Uses **OpenAI** or **Groq** models to summarize news articles |
| 🌦️ **Weather Integration** | ✅ Done | Displays current weather data via **OpenWeather API** |
| 🧠 **Read-Time & Bullet Summaries** | 🚧 In Progress | Adds estimated reading time and concise TL;DR bullet points |
| 🔒 **NextAuth Authentication** | ✅ Done | Provides secure login and session management |
| ⚡ **Server-Side Caching & ISR** | 🚧 In Progress | Improves load times and API efficiency using caching and incremental static regeneration |
| 📱 **Responsive UI** | ✅ Done | Mobile-friendly interface built with responsive design principles |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Framework | **Next.js (React 18)** |
| Authentication | **NextAuth.js** |
| AI Summarization | **OpenAI / Groq** |
| News Data | **NewsAPI.org** |
| Weather Data | **OpenWeather API** |
| Hosting | **Vercel** |
| Styling | **TailwindCSS** |

---

## ⚙️ Environment Variables

Create a `.env.local` file in your project root and configure the following:

```bash
# 🔐 Authentication
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# 📰 News API
NEWS_API_KEY=your_newsapi_key_here
NEWS_API_URL=https://newsapi.org/v2/top-headlines

# 🌤️ Weather API
WEATHER_KEY=your_openweather_api_key_here
WEATHER_URL=https://api.openweathermap.org/data/2.5/weather

# 🤖 AI Summarization
OPENAI_API_KEY=your_openai_api_key_here
GROQ_API_KEY=your_groq_api_key_here
