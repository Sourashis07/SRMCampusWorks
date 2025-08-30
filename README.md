# SRM Campus Works

A freelance platform for SRM University students to post and complete academic tasks.

## Features

- **Task Management**: Post and browse academic tasks
- **Bidding System**: Students can bid on tasks with proposals
- **Real-time Chat**: Communication between task posters and bidders
- **Payment Integration**: Secure payment processing
- **Profile Management**: Complete user profiles with skills and portfolio
- **Advanced Filters**: Filter tasks by category, budget, duration
- **Dark Mode**: Full dark/light theme support

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Firebase Authentication
- Axios
- React Router

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- Socket.io
- Firebase Admin

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Firebase project

### Installation

1. Clone the repository
```bash
git clone https://github.com/Sourashis07/SRMCampusWorks.git
cd SRMCampusWorks
```

2. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Environment Setup

Create `.env` files:

**Backend (.env)**
```
DATABASE_URL="your-postgresql-url"
JWT_SECRET="your-jwt-secret"
RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_KEY_SECRET="your-razorpay-secret"
FIREBASE_SERVICE_ACCOUNT_KEY="path-to-firebase-key.json"
PORT=5000
```

**Frontend (.env)**
```
VITE_FIREBASE_API_KEY="your-firebase-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_API_URL="http://localhost:5000"
```

4. Database Setup
```bash
cd backend
npx prisma db push
```

5. Run Development Servers
```bash
# Backend
cd backend
npm run dev

# Frontend (new terminal)
cd frontend
npm run dev
```

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

Set these in your Vercel dashboard:
- `DATABASE_URL`
- `JWT_SECRET`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `FIREBASE_SERVICE_ACCOUNT_KEY`

## Project Structure

```
SRMCampusWorks/
├── backend/
│   ├── routes/
│   ├── prisma/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── config/
│   ├── public/
│   └── package.json
├── vercel.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.