# WannaPlay

WannaPlay is a platform designed for board game enthusiasts to discover, like, and manage their favorite games. It features a recommendation system, user profiles, and an admin dashboard for managing games, categories, and users.

## Features
- **User Features**:
  - Browse and search for board games.
  - Like or dislike games to receive personalized recommendations.
  - View and manage your liked and disliked games.
- **Admin Features**:
  - Manage users, games, categories, designers, and publishers.
  - View detailed statistics and manage game-related entities.
- **Recommendation System**:
  - Suggest games based on user preferences and liked categories.

## Project Structure
- **Frontend**: Located in the `frontend` directory, built with Vue.js.
- **Backend**: Located in the `backend` directory, built with Node.js and Express.
- **Database**: SQL scripts for database setup and management are in the `database` directory.

## Prerequisites
1. [Node.js](https://nodejs.org/) (version 14 or higher recommended).
2. [MySQL](https://www.mysql.com/) installed and running.
3. A package manager like `npm` or `yarn`.

## Setup Instructions

### 1. Database Setup
1. Navigate to the `database` directory:
   ```bash
   cd database
   ```
2. Execute the `setup_database.sql` script to create and populate the database:
   ```sql
   SOURCE setup_database.sql;
   ```
   This script will:
   - Create the database schema.
   - Add indexes, triggers, views, and stored procedures.
   - Populate the database with initial data.
   - Set up the admin user.

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following content:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=board_game_db
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will be accessible at `http://localhost:5000`.

### 3. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory with the following content:
   ```
   VITE_API_URL=http://localhost:5000
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will be accessible at `http://localhost:3000`.

## Testing
- **Frontend**: Run `npm test` in the `frontend` directory.
- **Backend**: Run `npm test` in the `backend` directory.

## Deployment
1. Build the frontend for production:
   ```bash
   npm run build
   ```
   The production-ready files will be in the `dist` directory.
2. Deploy the backend and frontend to your preferred hosting services (e.g., AWS, Heroku, Netlify).

## Notes
- Ensure the backend is running before accessing the frontend.
- Use the admin account created during the database setup to access admin features.

## Troubleshooting
- If the database setup fails, ensure MySQL is running and the user has sufficient privileges.
- Check the `.env` files for correct configuration.
- Verify that the backend and frontend servers are running on the correct ports.

