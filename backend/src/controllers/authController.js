const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User, Role, Application } = require("../models/models");

const generateToken = function (data) {
  let jwtSecretKey = "lasdfjlaf@R$@R$%@$422kjfsfjsflj294725";

  let payload = {
    id: data.id,
    name: data.first_name + " " + data.last_name,
    email: data.email,
    role: data.role.type,
  };

  return jwt.sign(payload, jwtSecretKey, { expiresIn: "24h" });
};

exports.loginUser = async function (req, res) {
  try {
    const SALT_VALUE = "$2a$12$" + "dfa fafaf afafabcd dfsd  f reew weq";

    console.log("-----------------", req.body);
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
      include: Role,
    });

    console.log("USER", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("matches", passwordMatch);
    if (!passwordMatch) {
      return res.status(404).json({ message: "Password incorrect" });
    }

    const token = generateToken(user);
    return res.status(200).send({ token: token, role_id: user.role_id });
  } catch (error) {
    console.log(`authController.loginUser error: ${error}`);
    return res
      .status(404)
      .json({ message: "Provided credentials are not valid" });
  }
};