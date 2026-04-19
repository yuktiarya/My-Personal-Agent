# AI Agent

A robust, intelligent conversational agent built with Node.js and Google Gemini. The agent is capable of routing natural language queries and executing function calling to fetch live data such as cryptocurrency prices (via CoinGecko) and real-time weather information (via WeatherAPI). It features a modern, responsive Web Chat UI built with Express.js, providing an exceptional user experience out-of-the-box.

## Features

- **Google Gemini Integration**: Leverages the power of Gemini 2.0 Flash to process complex user queries and decide when to use external APIs.
- **Function Calling & Tool Usage**: 
  - 🌦️ **Weather Information**: Dynamically fetches current weather conditions globally via WeatherAPI.
  - 💰 **Cryptocurrency Tracking**: Fetches real-time price updates and market data for any cryptocurrency via the CoinGecko API.
- **Dynamic Web UI**: A beautiful, glassmorphic dark-themed chat interface with typing indicators, smooth animations, and message bubbles.
- **Express Backend**: A lightweight, fast Node/Express backend that handles routing and encapsulates API logic securely.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v18 or higher recommended)
- A Google Gemini API Key
- A WeatherAPI Key

## Installation

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Configure your environment variables:
   Create a `.env` file in the root directory and add your API keys:
   ```env
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```
   *(Note: The WeatherAPI key is currently hardcoded in the fetch URL but for best practices should also be moved into your `.env`.)*

## Usage

1. Start the server:
   ```bash
   node index.js
   ```

2. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

3. Type your query in the beautifully designed chat interface! Examples:
   - *"What is the current price of bitcoin?"*
   - *"Is it raining in London right now?"*

## Project Structure
- `index.js`: The Express server and core Agentic logic.
- `public/`: The frontend UI assets.
  - `index.html`: Web interface structure.
  - `css/style.css`: The UI design and glassmorphic styling.
  - `js/script.js`: Fetch API implementation to communicate with the Node backend.
- `.env`: Environment variables container.
