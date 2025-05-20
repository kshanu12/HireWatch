const jwt = require("jsonwebtoken");

/**
 * Verifies the JWT token which is provided in the reqeust header
 */
const authGuard = (req, res, next) => {
  // Token is of the form: Bearer <Token>
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).send({ message: "Token not provided" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!decoded) {
    return res.status(403).send({ message: "Invalid token" });
  }

  req.user = decoded;
  next();
};

module.exports = authGuard;