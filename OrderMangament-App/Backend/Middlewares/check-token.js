const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

const checktoken = (req, res, next) => {
  try {
    const beartoken = req.headers.authorization;
    if (!beartoken) {
      return res.status(403).json({ message: 'Not authorised' });
    }
    const token = beartoken.split(' ')[1];
    console.log(token);

    const key = JWT_SECRET;
    const isValid = jwt.verify(token, key);

    next();
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

module.exports = checktoken;
