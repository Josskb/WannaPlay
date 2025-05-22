# Database Setup Instructions

This directory contains all the SQL scripts required to set up the `board_game_db` database. Follow the steps below to create and populate the database.

## Prerequisites
1. Ensure you have MySQL installed and running.
2. Place all the SQL files in this directory in the same folder.
3. Use a MySQL client (e.g., MySQL Workbench, phpMyAdmin, or the MySQL command line).

## Steps to Set Up the Database
1. Open your MySQL client and connect to your database server.
2. Execute the `setup_database.sql` file, which will automatically run all the other SQL scripts in the correct order:
   ```sql
 \WannaPlay\database\setup_database.sql;
   ```
3. The `setup_database.sql` file performs the following steps:
   - **Step 1**: Creates the database schema (`schema.sql`).
   - **Step 2**: Adds indexes for performance optimization (`indexes.sql`).
   - **Step 3**: Defines triggers for automatic actions (`triggers.sql`).
   - **Step 4**: Creates stored procedures for advanced operations (`storedprocedure.sql`).
   - **Step 5**: Creates views for simplified queries (`views.sql`).
   - **Step 6**: Populates the database with initial data (`populate.sql`).
   - **Step 7**: Sets up the admin user (`admin_setup.sql`).
   - **Step 8**: Adds admin-specific procedures (`admin_procedures.sql`).
   - **Step 9**: Configures admin roles and privileges (`admin_role.sql`).
   - **Step 10**: Adds admin views (`admin_views.sql`).
   - **Step 11**: Adds transactional procedures (`transactions.sql`).
   - **Step 12**: Adds custom functions (`function.sql`).

## Notes
- Ensure all referenced files are in the same directory as `setup_database.sql`.
- If any errors occur, check the specific SQL file mentioned in the error message for debugging.
- After running the script, the database will be fully set up and ready to use.

## Testing the Setup
To verify the setup:
1. Check that the `board_game_db` database has been created.
2. Verify that all tables, views, triggers, and procedures exist.
3. Query the `Games` table to ensure it has been populated with initial data:
   ```sql
   SELECT * FROM Games;
   ```
4. Test the admin user setup by logging in with the credentials provided in `admin_setup.sql`.

## Troubleshooting
- If the `SOURCE` command is not recognized, ensure you are using the MySQL client and that the file path is correct.
- For permission issues, ensure your MySQL user has sufficient privileges to create databases, tables, and other objects.

