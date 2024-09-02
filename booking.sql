-- hostels table
CREATE TABLE hostels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) ,
    photos JSON,
    title VARCHAR(255),
    description TEXT
);

-- rooms table
CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hostel_id INT NOT NULL,
    title VARCHAR(255),
    price INT NOT NULL,
    maxPeople INT NOT NULL,
    description TEXT,
    roomNumber INT NOT NULL,
    floor INT CHECK (floor >= 0 AND floor <= 3),
    amenities JSON, 
    gender VARCHAR(8),
     isAvailable BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE CASCADE
);

-- room_photos table


-- users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    img TEXT NOT NULL,
    firstname VARCHAR(255) NOT NULL,   
    lastname VARCHAR(255) NOT NULL,
    sex VARCHAR(10) NOT NULL,
    level_ VARCHAR(255) NOT NULL,   
    course VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- admin table
CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    phoneNumber VARCHAR(15) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    img TEXT ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- bookings table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    hostel_id INT NOT NULL,
    room_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- payments table
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    amount INT NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- reviews table
-- CREATE TABLE reviews (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     room_id INT NOT NULL,
--     user_id INT NOT NULL,
--     rating INT CHECK (rating >= 0 AND rating <= 5),
--     comment TEXT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
-- );



-- Insert test data into hostels table
INSERT INTO hostels (name, address, photos, title, description)
VALUES
('Story Building ', 'Kumasi', '[{"url": "https://placehold.co/400/"}, {"url": "https://placehold.co/400/"}]', 'A Story Building with 2 floors', 'A cozy and affordable hostel located in the heart of the city.'),
('Separate building', 'Kumasi', '[{"url": "https://placehold.co/400/"}, {"url": "https://placehold.co/400/"}]', 'Only ground floor', 'Experience the calm and tranquility of the seaside at our hostel.');

-- Insert test data into rooms table
INSERT INTO rooms (hostel_id, title, price, maxPeople, description, roomNumber, floor, amenities, isAvailable)
VALUES
(1, 'Single Room', 3000, 1, 'A cozy single room.', 101, 1, '[{"name": "WiFi"}, {"name": "AC"}]', TRUE),
(1, 'Double Room', 2000, 2, 'A comfortable double room.', 272, 1, '[{"name": "WiFi"}, {"name": "AC"}, {"name": "TV"}]', TRUE),
(1, 'Tripple', 1500, 3, 'Three in a room.', 251, 2, '[{"name": "WiFi"}, {"name": "Balcony"}]', TRUE);




-- Insert test data into users table
INSERT INTO users (username, email, firstname, lastname, level_, course, phone, password, img, sex)
VALUES
('coleman', 'cc@example.com', 'Calvin', 'Coleman', 'Undergraduate', 'Computer Science', '123-456-7890', 'coleman', 'https://placehold.co/200/', "M"),
('showers', 'showers@example.com', 'Showers', 'Hostel', 'Postgraduate', 'Engineering', '098-765-4321', 'showers', 'https://placehold.co/200/' , "F");

-- Insert test data into admin table
INSERT INTO admin (username, email,phoneNumber password, img)
VALUES
('admin1', 'admin1@example.com','123456789', 'password', 'https://placehold.co/200/'),
('admin2', 'admin2@example.com', '987654321','password', 'https://placehold.co/200/');

-- Insert test data into bookings table
INSERT INTO bookings (user_id, hostel_id, room_id)
VALUES
(1, 1, 1),
(2, 1, 2);

-- Insert test data into payments table
INSERT INTO payments (booking_id, amount, payment_method, status)
VALUES
(1, 50.00, 'Credit Card', 'Paid'),
(2, 100.00, 'PayPal', 'Pending');

