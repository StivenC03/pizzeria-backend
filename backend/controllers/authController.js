const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Username già in uso" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.json({ success: true, message: "Registrazione completata!" });
  } catch (err) {
    res.status(500).json({ message: "Errore durante la registrazione" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Utente non trovato" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Password errata" });

    res.cookie('sessione_utente', user.username, { 
      httpOnly: true, 
      secure: true,       
      sameSite: 'none',   
      maxAge: 1000 * 60 * 60 * 24 
    });

    res.json({ success: true, message: "Login effettuato!", username: user.username });
  } catch (err) {
    res.status(500).json({ message: "Errore durante il login" });
  }
};

exports.checkSession = (req, res) => {
  const utenteLoggato = req.cookies.sessione_utente;
  if (utenteLoggato) {
    res.json({ loggedIn: true, username: utenteLoggato });
  } else {
    res.json({ loggedIn: false });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('sessione_utente', {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  });
  res.json({ success: true, message: "Logout effettuato" });
};