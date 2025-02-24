

CREATE TABLE district (
    id SERIAL PRIMARY KEY,
    district_name VARCHAR(255) NOT NULL
);

CREATE TABLE address (
    id SERIAL PRIMARY KEY,
    district BIGINT UNSIGNED REFERENCES district(id) ON DELETE SET NULL,
    street VARCHAR(255),
    city VARCHAR(255),
    zipcode VARCHAR(255),
    address_state VARCHAR(255),
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6)
);

CREATE TABLE user (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    district_id BIGINT UNSIGNED REFERENCES district(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_role (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(255) UNIQUE
);

CREATE TABLE permissions(
    id SERIAL PRIMARY KEY,
    permission_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE user_to_role (
    user_id BIGINT UNSIGNED REFERENCES user(id),
    role_id BIGINT UNSIGNED REFERENCES user_role(id),
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE role_to_permissions (
    role_id BIGINT UNSIGNED REFERENCES user_role(id),
    permission_id BIGINT UNSIGNED REFERENCES permissions(id),
    PRIMARY KEY (role_id, permission_id)
);

