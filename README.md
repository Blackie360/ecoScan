# EcoScan 🌿

An AI-powered outdoor discovery platform that helps users find nearby parks, nature walks, and hiking trails based on their mood, available time, and current location.

![EcoScan](public/Hiker%20in%20Vast%20Landscape.png)

## Features

- **AI-Powered Recommendations** – Get personalized outdoor space suggestions using OpenAI GPT-4o-mini via Vercel AI Gateway
- **Real-Time Weather Integration** – Recommendations include current weather conditions and advice
- **Location-Aware Discovery** – Geolocation support to find places near you with reverse geocoding
- **Google Places Integration** – Real photos, ratings, addresses, and Google Maps links for each destination
- **AI Image Generation** – Generate destination images using Google Gemini 2.5 Flash Image via Vercel AI Gateway
- **Interactive Chat Interface** – Conversational UI with streaming responses
- **Floating Chat Widget** – Access the AI assistant from any page
- **Beautiful Landing Page** – Modern, responsive design with smooth animations

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) (App Router)
- **AI**: [Vercel AI SDK](https://sdk.vercel.ai) with AI Gateway
- **UI**: [shadcn/ui](https://ui.shadcn.com) + [Tailwind CSS](https://tailwindcss.com)
- **Models**: 
  - OpenAI GPT-4o-mini (chat)
  - Google Gemini 2.5 Flash Image (image generation)
- **APIs**: 
  - Google Places API (location data & photos)
  - OpenStreetMap Nominatim (reverse geocoding)
  - Open-Meteo (weather data)

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm/yarn

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Vercel AI Gateway (required for AI features)
VERCEL_AI_GATEWAY_API_KEY=your_vercel_ai_gateway_api_key

# Alternative key name (also works)
AI_GATEWAY_API_KEY=your_ai_gateway_api_key

# Google Places API (required for location features)
GOOGLE_PLACES_API_KEY=your_google_places_api_key
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ecoscan.git
cd ecoscan

# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
├── app/
│   ├── (ui)/chat/        # Main chat interface
│   ├── api/
│   │   ├── ai/           # AI chat endpoint
│   │   └── image/        # Image generation endpoint
│   └── page.tsx          # Landing page
├── components/
│   ├── ChatWidget.tsx    # Floating chat widget
│   ├── DestinationImage.tsx  # Lazy-loaded destination images
│   ├── Hero.tsx          # Landing page hero section
│   └── ui/               # shadcn/ui components
├── lib/
│   └── tools/
│       ├── weather.ts    # Weather tool for AI
│       └── location.ts   # Location lookup tool
└── public/               # Static assets
```

## AI Tools

The AI assistant has access to these tools:

1. **Weather Tool** – Fetches current weather data for any location
2. **Location Tool** – Retrieves real-world details from Google Places API including:
   - Address and coordinates
   - Google Maps URL
   - Real photos
   - User ratings

## Usage

1. **Landing Page**: Click "Discover Nearby Places" to share your location and get instant recommendations
2. **Chat Interface**: Describe your mood, available time, and preferences to get personalized outdoor suggestions
3. **Recommendations**: Each recommendation includes:
   - AI-generated or real photos
   - Weather conditions
   - Transport options
   - What to bring
   - Safety notes
   - Direct Google Maps link

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ecoscan)

Make sure to add your environment variables in the Vercel dashboard.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with 💚 for nature lovers everywhere.
