-- Update both Supabase users with real Clerk User IDs
-- This connects your real Clerk accounts to the organizations

-- Update ashtonmedina22@gmail.com with real Clerk ID (Cosmic Portals Master)
UPDATE users 
SET clerk_id = 'user_339NGNvs776RVVWRdLkI1HbY7Y6'
WHERE email = 'ashtonmedina22@gmail.com';

-- Update ashton@partytimetexas.com with real Clerk ID (Party Time Texas)
UPDATE users 
SET clerk_id = 'user_339gbDa0AgrHZrm4IFR0qdX5RYm'
WHERE email = 'ashton@partytimetexas.com';

-- Verify both updates
SELECT 'Updated both users with real Clerk IDs' as status;
SELECT 
    id, 
    clerk_id, 
    email, 
    first_name, 
    last_name, 
    role, 
    organization_id,
    (SELECT name FROM organizations WHERE id = users.organization_id) as organization_name
FROM users 
WHERE email IN ('ashtonmedina22@gmail.com', 'ashton@partytimetexas.com');
