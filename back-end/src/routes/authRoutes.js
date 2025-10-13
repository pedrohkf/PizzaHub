const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator')

require('dotenv').config();
const router = express.Router();

router.post('/register', [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha precisa de 6 caracteres no mínimo')
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        const { name, email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (user) return res.status(409).json({ message: 'Email já cadastrado' });
            user = new User({ name, email, password });
            await user.save();
            res.status(201).json({ message: 'Usuário criado com sucesso ' })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'Email não encontrado' })

        const passwordValid = await user.checkPassword(password);

        if (!passwordValid) return res.status(400).json({ message: 'Senha inválida' })

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });

        res.json({ token })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Token não fornecido');

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Token inválido');
        req.user = user
        next();
    })
};
router.get('/user', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;