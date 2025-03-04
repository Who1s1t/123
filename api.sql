CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    position VARCHAR(255) NOT NULL
);

CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    date_created TIMESTAMP DEFAULT NOW(),
    date_updated TIMESTAMP DEFAULT NOW(),
    category VARCHAR(255),
    has_comments BOOLEAN DEFAULT FALSE
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    document_id INT REFERENCES documents(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT NOW(),
    date_updated TIMESTAMP DEFAULT NOW(),
    author_id INT REFERENCES users(id) ON DELETE CASCADE
);

-- Добавление тестового пользователя (пароль: 123456, хэшируйте перед использованием)
INSERT INTO users (name, password, position) VALUES ('admin', '$2a$10$GfJAgY7XfsE8fG8WpB6KjuKqEmo34FZi1/kzVZpk5myGcFfCr7w0y', 'Администратор');