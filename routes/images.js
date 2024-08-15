// routes/images.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const db = require('../config/db');

const sanitizeUsername = (username) => {
    return username.replace(/[^a-zA-Z0-9_-]/g, '');
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const sanitizedUsername = sanitizeUsername(req.user.username);
        const userDir = path.join(__dirname, '../public/images', sanitizedUsername);
        fs.mkdirSync(userDir, { recursive: true });
        cb(null, userDir);
    },
    filename: function (req, file, cb) {
        cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

router.post('/change-photo', ensureAuthenticated, upload.single('croppedImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No se subió ninguna imagen.' });
    }

    const sanitizedUsername = sanitizeUsername(req.user.username);
    const filePath = `/dash-bca/images/${sanitizedUsername}/${req.file.filename}`;

    db.query('UPDATE users SET profilePic = ? WHERE id = ?', 
             [filePath, req.user.id], 
             (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al actualizar la foto de perfil' });
        }
        res.json({ success: true, newImageUrl: filePath });
    });
});

module.exports = router;
