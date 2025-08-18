# Zlyzer

AI-powered TikTok video analysis platform that provides insights and analytics for TikTok content creators and marketers.

## Features

- 🎥 **TikTok Video Analysis**: Submit video URLs for AI-powered content analysis
- 📊 **Real-time Processing**: Live status updates during analysis
- 📈 **Usage Analytics**: Track daily analysis count and quota limits
- 🔐 **Google OAuth**: Secure authentication with Google accounts
- ⚡ **Real-time Dashboard**: Live usage statistics from backend API
- 📱 **Responsive Design**: Clean, modern interface with Nunito Sans typography

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Custom CSS
- **Authentication**: Supabase (Google OAuth)
- **API Integration**: RESTful API with Zanalyzer backend
- **Build Tool**: Vite with HMR

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Abuzaid911/Zlyzer.git
cd Zlyzer
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Add your Supabase configuration
```

4. Start the development server:
```bash
pnpm dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## API Integration

The frontend integrates with the Zanalyzer backend API:

- **Dashboard Data**: `GET /api/user/dashboard` - Usage statistics and recent requests
- **Video Analysis**: `POST /api/analysis-requests/` - Submit TikTok URLs for analysis
- **Analysis Status**: `GET /api/analysis-requests/{id}` - Check processing status
- **User Registration**: `POST /auth/signup` - Register authenticated users

## Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx          # Main dashboard interface
│   └── LandingPage.tsx        # Landing page component
├── contexts/
│   └── AuthContext.tsx        # Supabase authentication context
├── services/
│   └── api.ts                 # API service layer
├── lib/
│   └── supabase.ts           # Supabase client configuration
├── App.tsx                    # Main app component
├── main.tsx                   # App entry point
└── index.css                  # Global styles
```

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

### API Configuration

The app uses a Vite proxy for API requests in development:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'https://zanalyzer.fly.dev',
      changeOrigin: true,
      secure: true
    },
    '/auth': {
      target: 'https://zanalyzer.fly.dev',
      changeOrigin: true,
      secure: true
    }
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions or support, please open an issue on GitHub or contact the development team.