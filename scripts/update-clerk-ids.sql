-- Update Supabase users with real Clerk User IDs
-- This connects your real Clerk accounts to the organizations

-- Update ashtonmedina22@gmail.com with real Clerk ID
UPDATE users 
SET clerk_id = 'user_339NGNvs776RVVWRdLkI1HbY7Y6'
WHERE email = 'ashtonmedina22@gmail.com';

-- Verify the update
SELECT 'Updated users with real Clerk IDs' as status;
SELECT id, clerk_id, email, first_name, last_name, role, organization_id 
FROM users 
WHERE email IN ('ashtonmedina22@gmail.com', 'ashton@partytimetexas.com');
