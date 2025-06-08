-- Seed data for testing
-- Insert test users (passwords are hashed for 'password123')
INSERT INTO "users" ("id", "name", "email", "password", "role") VALUES
('user1', 'John Doe', 'john@example.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQq', 'USER'),
('user2', 'Jane Smith', 'jane@example.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQq', 'USER'),
('admin1', 'Admin User', 'admin@example.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQq', 'ADMIN');

-- Insert test schedules
INSERT INTO "schedules" ("id", "dayOfWeek", "startTime", "endTime", "userId") VALUES
('sched1', 'MONDAY', '09:00', '17:00', 'user1'),
('sched2', 'TUESDAY', '09:00', '17:00', 'user1'),
('sched3', 'WEDNESDAY', '09:00', '17:00', 'user1'),
('sched4', 'THURSDAY', '09:00', '17:00', 'user1'),
('sched5', 'FRIDAY', '09:00', '17:00', 'user1'),
('sched6', 'MONDAY', '10:00', '18:00', 'user2'),
('sched7', 'WEDNESDAY', '10:00', '18:00', 'user2'),
('sched8', 'FRIDAY', '10:00', '18:00', 'user2');

-- Insert test appointments
INSERT INTO "appointments" ("id", "title", "description", "date", "startTime", "endTime", "userId") VALUES
('appt1', 'Réunion équipe', 'Réunion hebdomadaire de l''équipe', '2024-01-15', '2024-01-15 10:00:00', '2024-01-15 11:00:00', 'user1'),
('appt2', 'Rendez-vous client', 'Présentation du projet', '2024-01-16', '2024-01-16 14:00:00', '2024-01-16 15:30:00', 'user1'),
('appt3', 'Formation', 'Formation sur les nouvelles technologies', '2024-01-17', '2024-01-17 09:00:00', '2024-01-17 12:00:00', 'user2');
