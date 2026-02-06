CREATE TABLE IF NOT EXISTS invitations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) NOT NULL UNIQUE,
    status ENUM('pending', 'confirmed', 'declined') DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS guests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invitation_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    is_attending BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE
);
