
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Accesso negato. Effettua il login.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next(); 
    } catch (error) {
        res.status(401).json({ message: 'Token non valido o scaduto.' });
    }
};