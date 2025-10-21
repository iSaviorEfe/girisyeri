# Invoice Management System - Setup Instructions

## Prerequisites
- Node.js 18+ installed on your computer
- npm or yarn package manager

## Installation Steps

1. **Copy all files from the project directory to your computer**
   - Copy everything from `/tmp/cc-agent/58983213/project` to your local directory

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - The `.env` file is already configured with Supabase credentials
   - No additional configuration needed

4. **Run the development server**
   ```bash
   npm run dev
   ```
   - The app will open at `http://localhost:5173`

5. **Build for production** (optional)
   ```bash
   npm run build
   ```
   - Creates optimized build in `dist/` folder

## Project Structure
```
project/
├── index.html              # Entry HTML file
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
├── .env                    # Supabase credentials
├── App.tsx                 # Main App component
├── src/
│   └── main.tsx           # React entry point
├── components/            # UI components
├── hooks/                 # Custom React hooks
├── styles/                # CSS files
└── utils/                 # Utility functions

```

## Features
- Create and manage invoices
- Track invoice status (draft, sent, in process, completed, logged)
- Real-time updates with automatic polling
- Multi-user support with audit trail

## Backend
- Edge Function API deployed on Supabase
- Database automatically configured
- No additional backend setup required

## Troubleshooting

**If you get module errors:**
- Delete `node_modules` folder
- Run `npm install` again

**If the dev server won't start:**
- Check that port 5173 is not in use
- Try `npm run dev -- --port 3000` to use a different port

**If you get build errors:**
- Make sure Node.js version is 18 or higher
- Run `node --version` to check

## Support
The backend API is already running at:
`https://lophfbfzftasmsgwjlrz.supabase.co/functions/v1/make-server-ec5ebf11`
