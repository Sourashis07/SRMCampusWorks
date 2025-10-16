# SRM Campus Works

A freelance platform for SRM University students to post and complete academic tasks.

Deployment Link: https://srm-campus-works.vercel.app/

##Working:
- A student(Admin) Post some work with the information and the budget of his work
- All other students(Bidders) see the posted task and then can bid on how much they want to work on
- Now the Admin can chose the best bid
- Bidder gets notified
- Bidder submits his work
- Admin has the access to accept or reject work after reviwing
- when admin accepts, the bidder's Qr comes up where the admin has to pay the predetermined amount
- The task closes.
  
## Features

- **Task Management**: Post and browse academic tasks
- **Bidding System**: Students can bid on tasks with proposals
- **Real-time Chat**: Communication between task posters and bidders
- **Payment Integration**: Secure payment processing
- **Profile Management**: Complete user profiles with skills and portfolio
- **Advanced Filters**: Filter tasks by category, budget, duration
- **Dark Mode**: Full dark/light theme support


ScreenShots:
<img width="1919" height="940" alt="image" src="https://github.com/user-attachments/assets/4f1c10db-01f0-42b0-8c79-42ffce8866c9" />
<img width="1919" height="935" alt="image" src="https://github.com/user-attachments/assets/096c393b-2593-43c0-9eba-32409d5a1399" />
<img width="1919" height="940" alt="image" src="https://github.com/user-attachments/assets/40c9f68a-ebb4-4035-bd8a-0c3d4883d167" />
<img width="1919" height="938" alt="image" src="https://github.com/user-attachments/assets/a31ac146-06b2-447e-bb47-eca69b0bbd13" />
<img width="1919" height="938" alt="image" src="https://github.com/user-attachments/assets/d796e376-400c-4a06-a679-91a1eb74f01e" />
<img width="1919" height="942" alt="image" src="https://github.com/user-attachments/assets/aff86940-24cb-444b-b1b6-f94b0e74abaf" />
<img width="1919" height="936" alt="image" src="https://github.com/user-attachments/assets/e6626985-f04c-4785-af44-c8cd1c1de8fd" />






## Tech Stack

### Frontend
- React 18
- Vite
- Firebase Authentication
- React Router

### Backend
- Node.js
- Firebase Admin

## Getting Started

### Prerequisites
- Node.js 18+
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
