# EcoScan 🗑️

An AI-powered disposal guide for Kenya that helps users properly dispose of waste items by analyzing images and providing personalized recommendations.

![EcoScan](public/Hiker%20in%20Vast%20Landscape.png)

## Features

- **AI-Powered Image Analysis** – Upload or capture photos to identify items and get disposal recommendations using OpenAI GPT-4o-mini via Vercel AI Gateway
- **Kenya-Specific Guidance** – Get recommendations based on local regulations, facilities, and recycling programs in Kenya
- **Multimodal AI** – Vision-capable model analyzes images to identify materials, categories, and disposal methods
- **Step-by-Step Instructions** – Clear, actionable disposal steps for each item
- **Safety Warnings** – Learn about potential hazards before disposing of items
- **Recycling Information** – Know which items can be recycled and where
- **Location Details** – Find specific disposal locations and facilities in Kenya
- **Interactive Chat Interface** – Conversational UI with streaming responses
- **Beautiful Rusty Theme** – Warm, earthy color palette inspired by rust and terracotta

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) (App Router)
- **AI**: [Vercel AI SDK](https://sdk.vercel.ai) with AI Gateway
- **UI**: [shadcn/ui](https://ui.shadcn.com) + [Tailwind CSS](https://tailwindcss.com)
- **Models**: 
  - OpenAI GPT-4o-mini (vision-capable for image analysis)
- **Styling**: Custom rusty color palette with warm, earthy tones

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
│   ├── (ui)/chat/        # Main disposal scanning interface
│   ├── api/
│   │   └── ai/           # AI disposal analysis endpoint
│   └── page.tsx          # Landing page
├── components/
│   ├── Hero.tsx          # Landing page hero section
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── schemas/
│   │   └── recommendations.ts  # Disposal recommendation schema
│   └── tools/            # (Legacy tools - not used in disposal flow)
└── public/               # Static assets
```

## Usage

1. **Landing Page**: Click "Scan Your Item" to start analyzing disposal items
2. **Camera/Upload**: Take a photo with your camera or upload an image of the item
3. **AI Analysis**: The AI identifies the item, materials, and category
4. **Recommendations**: Get personalized disposal guidance including:
   - Disposal method (Recycle, Compost, Landfill, etc.)
   - Step-by-step instructions
   - Safety hazards (if any)
   - Recycling availability
   - Kenya-specific location information
   - Environmental impact notes

## Disposal Categories

The app helps with:
- **Plastic** items
- **Electronic** waste
- **Organic** materials
- **Hazardous** substances
- **General Waste**
- And more!

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ecoscan)

Make sure to add your environment variables in the Vercel dashboard.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with 🗑️ for responsible disposal in Kenya.
