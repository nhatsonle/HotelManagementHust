// Middleware kiểm tra token/quyền truy cập cho các route cần xác thực

const jwt = require('jsonwebtoken');
const { secretKey } = require('../config');

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send({ message: 'No token provided.' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(500).send({ message: 'Failed to authenticate token.' });
        }

        req.userId = decoded.id;
        next();
    });
};

module.exports = authMiddleware;