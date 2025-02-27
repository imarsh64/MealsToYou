-- Insert Districts
INSERT INTO district (district_name) VALUES 
('North District'),
('South District'),
('East District'),
('West District');

-- Insert Addresses
INSERT INTO address (district, street, city, address_state, zipcode) VALUES
(1, '1712 S 12th St', 'Waco', 'TX', 76706),
(1, '1613 James Ave', 'Waco', 'TX', 76706),
(2, '1226 Speight Ave', 'Waco', 'TX', 76706),
(2, '500 Bagby Ave', 'Waco', 'TX', 76706);

-- Insert Roles
INSERT INTO user_role (role_name) VALUES 
('district_admin'),
('district_user'),
('superadmin'),
('view_only');

-- Insert Permissions
INSERT INTO permissions (permission_name) VALUES 
('create_admin'),
('create_district_admin'),
('create_district'),
('create_user'),
('view_routes'),
('add_address'),
('delete_address');

-- Insert Users with SHA256 hashed "password"
INSERT INTO user (email, password_hash, district_id, active) VALUES 
('admin@example.com', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd287f7f0f01e93d2c7', 1, TRUE), 
('user1@example.com', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd287f7f0f01e93d2c7', 2, TRUE), 
('viewer@example.com', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd287f7f0f01e93d2c7', 2, TRUE); 

-- Assign Roles to Users
INSERT INTO user_to_role (user_id, role_id) VALUES 
(1, 1), -- district_admin
(2, 1), -- district_admin
(3, 2); -- district_user

-- Assign Permissions to Roles
INSERT INTO role_to_permissions (role_id, permission_id) VALUES 
(3, 1), -- superadmin can create admin
(3, 2), -- superadmin can create district admin
(3, 3), -- superadmin can create district
(3, 4), -- superadmin can create user
(3, 5), -- superadmin can view routes
(3, 6), -- superadmin can add address
(3, 7), -- superadmin can delete address
(2, 5), -- district_user can view routes
(2, 6), -- district_user can add address
(2, 7), -- district_user can delete address
(1, 4), -- district_admin can create user
(1, 5), -- district_admin can view routes
(1, 6), -- district_admin can add address
(1, 7); -- district_admin can create user
