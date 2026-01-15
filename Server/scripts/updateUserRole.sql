-- Update user role to Admin
UPDATE users SET role = 'Admin' WHERE email = 'rifat@gmail.com';

-- Verify the update
SELECT id, name, email, role FROM users WHERE email = 'rifat@gmail.com';
