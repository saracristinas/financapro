-- Script para criar usuário ADMIN no FinançaPro
-- ⚠️ EXECUTE APENAS UMA VEZ!

-- Senha: Admin@123 (criptografada com BCrypt)
-- Hash gerado: $2a$10$slYQmyNdGzin7olVAklFOOJyhtsDMi0rB7xWfXQpl2.P2zDh3xZK2

INSERT INTO users (email, password, name, avatar_color, role, security_question, security_answer, created_at)
VALUES (
    'admin@financapro.com',
    '$2a$10$slYQmyNdGzin7olVAklFOOJyhtsDMi0rB7xWfXQpl2.P2zDh3xZK2',
    'Admin',
    '#f59e0b',
    'ADMIN',
    'Qual é o seu sobrenome?',
    'admin',
    NOW()
);

-- Depois que criar, use para login:
-- Email: admin@financapro.com
-- Senha: Admin@123

