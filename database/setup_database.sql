-- Step 1: Create the database schema
SOURCE schema.sql;

-- Step 2: Add indexes
SOURCE indexes.sql;

-- Step 3: Add triggers
SOURCE triggers.sql;

-- Step 4: Add stored procedures
SOURCE storedprocedure.sql;

-- Step 5: Add views
SOURCE views.sql;

-- Step 6: Populate the database with initial data
SOURCE populate.sql;

-- Step 7: Add admin setup
SOURCE admin_setup.sql;

-- Step 8: Add admin-specific procedures
SOURCE admin_procedures.sql;

-- Step 9: Add admin roles and privileges
SOURCE admin_role.sql;

-- Step 10: Add admin views
SOURCE admin_views.sql;

-- Step 11: Add transactional procedures
SOURCE transactions.sql;

-- Step 12: Add custom functions
SOURCE function.sql;
