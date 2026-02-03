-- Manual seed data for testing
-- Password for all users: password123 (hashed with bcrypt)

INSERT INTO "User" (id, email, password, name, username, avatar, bio, "createdAt", "updatedAt")
VALUES
  ('user-1', 'alice@socialvibe.com', '$2b$10$rN8qEX.E3fZy0mLjZ9XqS.YKz5z5z5z5z5z5z5z5z5z5z5z5z5z5u', 'Alice Martin', 'alice', 'https://i.pravatar.cc/150?img=1', 'Travel enthusiast 🌍', NOW(), NOW()),
  ('user-2', 'bob@socialvibe.com', '$2b$10$rN8qEX.E3fZy0mLjZ9XqS.YKz5z5z5z5z5z5z5z5z5z5z5z5z5z5u', 'Bob Johnson', 'bob', 'https://i.pravatar.cc/150?img=12', 'Tech geek 💻', NOW(), NOW()),
  ('user-3', 'charlie@socialvibe.com', '$2b$10$rN8qEX.E3fZy0mLjZ9XqS.YKz5z5z5z5z5z5z5z5z5z5z5z5z5z5u', 'Charlie Davis', 'charlie', 'https://i.pravatar.cc/150?img=13', 'Fitness coach 💪', NOW(), NOW());

INSERT INTO "Post" (id, caption, image, "authorId", "createdAt", "updatedAt")
VALUES
  ('post-1', 'Just got back from an amazing trip! 🗼✨', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', 'user-1', NOW(), NOW()),
  ('post-2', 'New tech setup complete! 🖥️', 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800', 'user-2', NOW(), NOW()),
  ('post-3', 'Morning workout done! 💪', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 'user-3', NOW(), NOW());
