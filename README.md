## Character Chat

A Character.AI–style chat experience showcasing mobile-first UI, playful animations, and realtime conversations. Built with Next.js, Firebase, Tailwind CSS, Framer Motion, and Groq’s LLM API.

- **Live Features**: Email/password authentication, curated persona roster, realtime message sync with Firebase, Groq-powered AI replies, and animated micro-interactions optimised for touch.
- **Pages**: `/` login, `/chat` history, `/chat/[characterId]` conversation, `/characters` persona browser.

### Tech Stack

- Next.js 15 (App Router) + React 19
- Tailwind CSS v4 + custom shadcn-inspired components
- Firebase Authentication & Firestore Realtime Database
- Framer Motion for transitions & micro-interactions
- Groq LLM (default model: `llama-3.1-8b-instant`)
- TypeScript

### Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment example and fill in your keys:
   ```bash
   cp .env.example .env.local
   ```
3. Provide Firebase configuration and a Groq API key (see below).
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000 and sign in with your email to explore the experience.

### Environment Variables

| Key | Description |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `GROQ_API_KEY` | Groq console API key |
| `GROQ_MODEL` _(optional)_ | Override the default Groq model |

### Firebase Configuration

Enable Email/Password in Firebase Authentication and create a Firestore database in “production mode” with the default rules. The app stores chats at `users/{userId}/chats/{characterId}` with a `messages` subcollection per chat.

### Deployment

- Create a Vercel project, connect the repository, and add the environment variables above in the Vercel dashboard.
- Set the build command to `npm run build` and the output directory to `.next`.
- Provide the same Firebase and Groq secrets for production.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create an optimized production build |
| `npm start` | Run the production server |
| `npm run lint` | Lint the project with ESLint |

### Notes

- LLM requests stream token-by-token from the Groq Chat Completions API for a responsive typing effect.
- UI components follow a shadcn-inspired approach with Tailwind + class variance authority to keep styling consistent and themeable.
- The chat surface is optimised for mobile but scales gracefully to tablet/desktop breakpoints.
