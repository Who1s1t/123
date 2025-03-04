require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const pgp = require('pg-promise')();

const app = express();
const db =  pgp({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});
app.use(express.json());
app.use(cors());

const SECRET_KEY = process.env.JWT_SECRET;

// Middleware для проверки JWT
function authenticateToken(req, res, next) {
    let token = req.header('Authorization');
    if (!token) return res.status(403).json({ message: 'Доступ запрещен', errorCode: 1001 });
    token = token.split(' ')[1]
    jwt.verify(token, SECRET_KEY, (err, user) => {

        if (err) return res.status(403).json({ message: 'Недействительный токен', errorCode: 1002 });
        req.user = user;
        next();
    });
}

// Вход и генерация JWT
app.post('/api/v1/SignIn', async (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
        return res.status(400).json({ message: 'Неверный запрос', errorCode: 1003 });
    }
    try {
        const user = await db.oneOrNone('SELECT * FROM users WHERE name = $1', [name]);
        console.log(12)
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(403).json({ message: 'Неверные учетные данные', errorCode: 1004 });
        }
        const token = jwt.sign({ id: user.id, name: user.name, position: user.position }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Ошибка сервера', errorCode: 1005 });
    }
});

// Получить список документов
app.get('/api/v1/Documents', authenticateToken, async (req, res) => {
    try {
        const documents = await db.any('SELECT * FROM documents');
        res.json(documents);
    } catch (error) {

        res.status(500).json({ message: 'Ошибка сервера', errorCode: 1006 });
    }
});

// Получить список комментариев к документу
app.get('/api/v1/Document/:documentId/Comments', authenticateToken, async (req, res) => {
    const { documentId } = req.params;
    try {
        const comments = await db.any(
            `SELECT c.id, c.document_id, c.text, c.date_created, c.date_updated, 
                    u.name AS author_name, u.position AS author_position 
             FROM comments c
             JOIN users u ON c.author_id = u.id
             WHERE c.document_id = $1`, [documentId]
        );
        if (comments.length === 0) {
            return res.status(404).json({ message: 'Не найдены комментарии для документа', errorCode: 2344 });
        }
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', errorCode: 1007 });
    }
});

// Отправить комментарий к документу
app.post('/api/v1/Document/:documentId/Comment', authenticateToken, async (req, res) => {
    const { documentId } = req.params;
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ message: 'Текст комментария обязателен', errorCode: 1008 });
    }
    try {
        const newComment = await db.one(
            `INSERT INTO comments (document_id, text, author_id, date_created, date_updated) 
             VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *`,
            [documentId, text, req.user.id]
        );
        res.json(newComment);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', errorCode: 1009 });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
