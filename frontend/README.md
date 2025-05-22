# WannaPlay Frontend

This directory contains the frontend application for the WannaPlay project. The frontend is responsible for providing a user interface to interact with the backend services and database.

## Features
- User authentication and profile management.
- Browse and search for board games.
- Like or dislike games and view recommendations.
- Manage categories, designers, and publishers.
- Admin panel for managing users, games, and other entities.

## Prerequisites
1. Ensure you have [Node.js](https://nodejs.org/) installed (version 14 or higher is recommended).
2. Install a package manager like `npm` (comes with Node.js) or `yarn`.

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/WannaPlay.git
   cd WannaPlay/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the `frontend` directory.
   - Add the following variables:
     ```
     REACT_APP_API_URL=http://localhost:5000/api
     REACT_APP_AUTH_SECRET=your_auth_secret
     ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Build for Production
To build the application for production, run:
```bash
npm run build
```
The production-ready files will be generated in the `build` directory.

## Folder Structure
- **`src/`**: Contains the source code for the application.
  - **`assets/`**: Contains static files such as images, fonts, and icons used throughout the application.
  - **`components/`**: Reusable UI components.
- **`public/`**: Static assets like images and the `index.html` file.

## Testing
Run the following command to execute tests:
```bash
npm test
```

## Deployment
1. Build the application using `npm run build`.
2. Deploy the contents of the `build` directory to your preferred hosting service (e.g., Netlify, Vercel, or AWS S3).

## Notes
- Ensure the backend is running and accessible at the URL specified in `REACT_APP_API_URL`.
- For admin features, log in with an admin account created during the database setup.

## Troubleshooting
- If the application fails to start, ensure all dependencies are installed and the `.env` file is correctly configured.
- Check the browser console for errors and verify the backend API is running.

