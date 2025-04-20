# Stampify

Stampify is a web community platform for philatelists (stamp collectors) that aims to solve common problems in the philately community such as lack of online communities and proper information sharing.

## Features

- User authentication and profiles
- Stamp collection management
- Community discussions
- Search functionality
- Camera integration for stamp identification
- Personal collection showcase

## Tech Stack

- Frontend: Next.js 14 with TypeScript
- Styling: Tailwind CSS
- UI Components: shadcn/ui
- Animations: Framer Motion
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: Firebase
- Image Storage: Firebase Storage

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   FIREBASE_APP_ID=your_firebase_app_id
   JWT_SECRET=your_jwt_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (main)/            # Main application routes
│   └── api/               # API routes
├── components/            # Reusable components
├── lib/                   # Utility functions and configurations
├── models/               # MongoDB models
├── styles/               # Global styles
└── types/                # TypeScript type definitions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
