# WannaPlay Backend

This directory contains the backend application for the WannaPlay project. The backend is responsible for managing the database, handling API requests, and implementing business logic.

## Features
- User authentication and authorization.
- API endpoints for managing users, games, categories, and more.
- Integration with the database for CRUD operations.
- Recommendation system based on user preferences.
- Admin-specific endpoints for managing the platform.

## Prerequisites
1. Ensure you have [Node.js](https://nodejs.org/) installed (version 14 or higher is recommended).
2. Install a package manager like `npm` (comes with Node.js) or `yarn`.
3. Ensure you have MySQL installed and running.

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/WannaPlay.git
   cd WannaPlay/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the `backend` directory.
   - Add the following variables:
     ```
     DB_HOST=localhost
     DB_PORT=3306
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=board_game_db
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. The backend will be accessible at `http://localhost:5000`.

## API Documentation
The backend exposes the following API endpoints:

### User Endpoints
- `POST /api/users/register` - Register a new user.
- `POST /api/users/login` - Authenticate a user and return a JWT token.
- `GET /api/users/profile` - Retrieve the authenticated user's profile.

### Game Endpoints
- `GET /api/games` - Retrieve a list of all games.
- `POST /api/games` - Add a new game (admin only).
- `PUT /api/games/:id` - Update a game's details (admin only).
- `DELETE /api/games/:id` - Delete a game (admin only).

### Recommendation Endpoints
- `GET /api/recommendations` - Get game recommendations for the authenticated user.

### Admin Endpoints
- `GET /api/admin/users` - Retrieve a list of all users.
- `GET /api/admin/games` - Retrieve a list of all games.
- Additional admin endpoints for managing categories, designers, and publishers.

## Testing
Run the following command to execute tests:
```bash
npm test
```

## Deployment
1. Ensure the `.env` file is correctly configured for the production environment.
2. Build the application:
   ```bash
   npm run build
   ```
3. Deploy the application to your preferred hosting service (e.g., AWS, Heroku, or DigitalOcean).

## Notes
- Ensure the database is set up and populated using the SQL scripts in the `database` directory.
- Use the `JWT_SECRET` environment variable to secure user authentication.

## Troubleshooting
- If the server fails to start, ensure all dependencies are installed and the `.env` file is correctly configured.
- Check the logs for error messages and verify the database connection.

