@echo off
echo Setting up SRMCampusWorks...

cd backend
echo Installing backend dependencies...
npm install

echo Setting up database...
npx prisma generate
npx prisma db push

cd ../frontend
echo Installing frontend dependencies...
npm install

echo Setup complete! 
echo 1. Update backend/.env with your PostgreSQL credentials
echo 2. Run 'npm run dev' in backend folder
echo 3. Run 'npm run dev' in frontend folder