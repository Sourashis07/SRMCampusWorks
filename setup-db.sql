-- Connect to PostgreSQL and run these commands
CREATE DATABASE srm_campus_works;
CREATE USER campus_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE srm_campus_works TO campus_user;