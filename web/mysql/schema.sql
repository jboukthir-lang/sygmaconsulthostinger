-- ==========================================
-- MySQL Schema for Priorities & Tasks
-- To run alongside Supabase
-- ==========================================

-- Database: u611120010_sygma

-- 1. Priorities/Categories Table
CREATE TABLE IF NOT EXISTS priorities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100),
    name_fr VARCHAR(100),
    color VARCHAR(20) DEFAULT '#001F3F',
    icon VARCHAR(50),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active (is_active),
    INDEX idx_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority_id INT,
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    assigned_to VARCHAR(255), -- User ID from Supabase/Firebase
    due_date DATE,
    completed_at TIMESTAMP NULL,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (priority_id) REFERENCES priorities(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_assigned (assigned_to),
    INDEX idx_due_date (due_date),
    INDEX idx_priority (priority_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Task Comments/Notes
CREATE TABLE IF NOT EXISTS task_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    INDEX idx_task (task_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Task Attachments
CREATE TABLE IF NOT EXISTS task_attachments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size INT, -- in bytes
    uploaded_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    INDEX idx_task (task_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Insert default priorities
INSERT INTO priorities (name, name_ar, name_fr, color, icon, display_order) VALUES
('High Priority', 'أولوية عالية', 'Priorité élevée', '#DC2626', 'AlertCircle', 1),
('Medium Priority', 'أولوية متوسطة', 'Priorité moyenne', '#F59E0B', 'Clock', 2),
('Low Priority', 'أولوية منخفضة', 'Priorité faible', '#10B981', 'CheckCircle', 3),
('Urgent', 'عاجل', 'Urgent', '#7C3AED', 'Zap', 0)
ON DUPLICATE KEY UPDATE name=name;

-- 6. Sample tasks for testing
INSERT INTO tasks (title, description, priority_id, status, due_date) VALUES
('Setup MySQL Integration', 'Integrate MySQL with Next.js application', 1, 'in_progress', DATE_ADD(CURDATE(), INTERVAL 2 DAY)),
('Test Database Connection', 'Verify MySQL connection from web app', 2, 'pending', DATE_ADD(CURDATE(), INTERVAL 3 DAY)),
('Deploy to Production', 'Deploy updates to Hostinger', 1, 'pending', DATE_ADD(CURDATE(), INTERVAL 5 DAY))
ON DUPLICATE KEY UPDATE title=title;

-- ==========================================
-- Views for easier querying
-- ==========================================

-- View: Tasks with priority details
CREATE OR REPLACE VIEW tasks_with_priority AS
SELECT
    t.*,
    p.name as priority_name,
    p.name_ar as priority_name_ar,
    p.name_fr as priority_name_fr,
    p.color as priority_color,
    p.icon as priority_icon
FROM tasks t
LEFT JOIN priorities p ON t.priority_id = p.id;

-- View: Task statistics
CREATE OR REPLACE VIEW task_stats AS
SELECT
    status,
    COUNT(*) as count,
    COUNT(CASE WHEN due_date < CURDATE() AND status != 'completed' THEN 1 END) as overdue
FROM tasks
GROUP BY status;

-- ==========================================
-- Stored Procedures
-- ==========================================

DELIMITER //

-- Procedure: Complete a task
CREATE PROCEDURE IF NOT EXISTS complete_task(IN task_id_param INT)
BEGIN
    UPDATE tasks
    SET status = 'completed',
        completed_at = CURRENT_TIMESTAMP
    WHERE id = task_id_param;
END //

-- Procedure: Get user's tasks
CREATE PROCEDURE IF NOT EXISTS get_user_tasks(IN user_id_param VARCHAR(255))
BEGIN
    SELECT * FROM tasks_with_priority
    WHERE assigned_to = user_id_param
    ORDER BY
        CASE status
            WHEN 'in_progress' THEN 1
            WHEN 'pending' THEN 2
            WHEN 'completed' THEN 3
            ELSE 4
        END,
        due_date ASC;
END //

DELIMITER ;

-- ==========================================
-- Summary
-- ==========================================

SELECT
    'MySQL Schema Created Successfully' as status,
    (SELECT COUNT(*) FROM priorities) as total_priorities,
    (SELECT COUNT(*) FROM tasks) as total_tasks;
