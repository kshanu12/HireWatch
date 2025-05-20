const jwt = require("jsonwebtoken");

/**
 * Checks if the user has the required role for make API request to this route
 */
const roleGuard = (requiredRole) => {
  return (req, res, next) => {
    // token is of the form Bearer <Token>
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).send({ message: "Token not provided" });
    }

    const userRole = jwt.verify(token, process.env.JWT_SECRET_KEY).role;
    if (requiredRole.includes(userRole)) {
      next();
    } else {
      return res.status(403).send({ message: "Access Denied" });
    }
  };
};

module.exports = roleGuard;