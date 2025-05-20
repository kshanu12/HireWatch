const nodemailer = require("nodemailer");
require("dotenv").config();
const { User, Role, Application } = require("../models/models");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const generateCryptoHex = () => {
  const randomBytes = crypto.randomBytes(6);
  const hexValue = randomBytes.toString("hex");
  return hexValue;
};

const hashPassword = async function (password) {
  const SALT_ROUNDS = 12;

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPassword;
};

exports.hashPassword = hashPassword;

exports.authenticateUser = async function (req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(403).json({ message: "User doesn't exist" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(403).json({ message: "Incorrect Password" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(`userController.authenticateUser: ${error}`);
    return res.status(403).json({ message: "failure" });
  }
};

/**
 *
 * Fetch all the records from the `User` table
 */
exports.getAllUsers = async function (req, res) {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.log(`userController.getAllUsers: ${error}`);
    res.status(500).json({ error: "An error occurred while retrieving users" });
  }
};

/**
 *  Create a new record in the `User` table. The request body must contain:
 *  - first_name
 *  - last_name
 *  - email
 *  - password
 *  - phone
 *  - role_id
 */
exports.addUser = async function (req, res) {
  try {
    console.log(req.body);
    let userDetails = req.body;
    userDetails.password = await hashPassword(userDetails.password);
    let user;
    if (await Role.findByPk(req.body.role_id)) {
      user = await User.create(userDetails);
    } else {
      return res.status(404).json({ error: "Role not found" });
    }

    return res.status(201).json(user);
  } catch (error) {
    console.log(`userController.addUser: ${error}`);
    return res
      .status(500)
      .json({ message: "Failed to add user to the database" });
  }
};

const updateUserPassword = async function (id, password) {
  try {
    const application = await Application.findOne({ where: { id } });
    // console.log("-----------------------------------------------------------",application);
    if (!application) {
      return res
        .status(403)
        .send({ message: "Invalid application doesn't exist" });
    }

    const user = await User.update(
      { password },
      { where: { id: application.user_id } },
      { include: Role }
    );


    if (!user) {
      return res
        .status(403)
        .send({ message: "Failed to update user password" });
    }


    // console.log("====", application);
  } catch (error) {
    // console.log("error");

    return error;
  }
};


const sendIndividualEmail = async (
  application_id,
  email,
  user_name,
  test_name,
  test_duration
) => {
  try {
    // console.log(application_id, email, user_name, test_name, test_duration);
    const testLink = `https://hirewatch-frontend-urtjok3rza-wl.a.run.app?id=${application_id}`;



    let oneTimePassword = generateCryptoHex();
    console.log("hashPassword", oneTimePassword);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "1rn19is071.kumarshanu@gmail.com",
        pass: "pcijcjxdmkpjuzmc",
      },
    });
    const mailOptions = {
      from: "1rn19is071.kumarshanu@gmail.com",
      to: `${email}`,
      subject: "Invitation to Complete Assessment!!!",
      html: `<div style="background:#f5f7ff;font-size:16px;width:40vw;padding:20px;" >
  <p>
    Hi ${user_name},
  </p>     
  <p>
    Congratulations! We are pleased to inform you that based on your application, you have been shortlisted to take the <strong>${test_name}</strong> test.
  </p>
  <p>
    We appreciate your time and effort in the application process.
  </p>
  <p>
    Attached below is your login credentials:
  </p>
  <p>
    <strong>
      Username :
    </strong> 
    ${email}
  </p>
  <p>
    <strong>
      Password :
    </strong> 
    ${oneTimePassword}
  </p>     
  <p>
    You can access the test by clicking on the following button:
  </p>
  <div style="width:40vw;margin-bottom:15px">
    <button style="background:#4a64e9;padding:10px 15px;font-size:16px;border-radius:10px">
      <a href="${testLink}" style="font-weight:700;color:white;text-decoration:none">
        Start the test
      </a>
    </button>
  </div>
  <div style="background:white;border-radius:8px;padding:10px">
    <strong style="font-size:18px">Get ready for your challenge</strong>
    <ul style="color:#696969;">
      <li style="padding-bottom:10px">Once you begin the challenge you must complete it in <strong>${test_duration} minutes</strong>.</li>
        <li style="padding-bottom:10px">Tasks cannot be paused and you will only get <strong>one attempt</strong>.</li>
        <li style="padding-bottom:10px">You must click Submit after you answer all questions.</li>
      <li>If you accidentally close your browser, use the link from this email to open the event page again and continue the challenge.</li>

    </ul>
  </div>
  <div style="display:flex;margin-top:15px">
    <div>
      <a href="https://imgbb.com/"><img src="https://i.ibb.co/Th4RpQZ/hashedin-recruitment-logo-removebg-preview.png" alt="hashedin-recruitment-logo-removebg-preview" border="0"></a>
    </div>
    <div>
      <p>Regards,</p>
      <a href="https://imgbb.com/"><img src="https://i.ibb.co/LRx9Xxr/hashedin-logo.png" alt="hashedin-logo" border="0">
      </a>
    </div>
  </div>
</div>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    }
    );
    oneTimePassword = await hashPassword(oneTimePassword);
    updateUserPassword(application_id, oneTimePassword);
  } catch (error) {
    console.log("ERROR : ",error);
  }
};

exports.sendemail = async function (req, res) {
  try {
    console.log("++++++++++++++++++++++++++++++++++++", req.body.candidates);
    req.body.candidates.map((candidate) => {
      sendIndividualEmail(
        candidate.application_id,
        candidate.email,
        candidate.first_name,
        candidate.test_name,
        candidate.duration
      );
    });
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(`userController.getUserById: ${error}`);
    return res
      .status(404)
      .json({ message: "Failed to fetch user from the database" });
  }
};


/**
 * Fetch the user from the `User` table by `id`
 */
exports.getUserById = async function (req, res) {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ["first_name", "last_name", "email", "phone"],
      include: ["role"],
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(`userController.getUserById: ${error}`);
    return res
      .status(404)
      .json({ message: "Failed to fetch user from the database" });
  }
};

/**
 * Update the details of the user based on the `id` in the request body.
 * Usually, we update:
 *  - first_name
 *  - last_name
 *  - email
 *  - phone
 *  - password
 *  - application_id
 *  - role
 *  - test_id
 *
 * Since, test_id has Many-to-Many relationship, updating test_id simply adds
 * another relationship between user and test. It doesn't overwrites the
 * existing ones.
 */
exports.updateUserById = async function (req, res) {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const {
      first_name,
      last_name,
      email,
      phone,
      password,
      application_id,
      role_id,
      test_id,
    } = req.body;

    const updatedFields = {};

    if (first_name) updatedFields.first_name = first_name;
    if (last_name) updatedFields.last_name = last_name;
    if (email) updatedFields.email = email;
    if (phone) updatedFields.phone = phone;
    if (password) updatedFields.password = await hashPassword(password);
    if (application_id) updatedFields.application_id = application_id;
    if (role_id) updatedFields.role_id = role_id;
    if (test_id) updatedFields.test_id = test_id;

    await user.update(updatedFields);

    // Fetch the updated user with associated data
    const updatedUser = await User.findByPk(id, {
      include: ["role"],
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(`userController.updateUserById: ${error}`);
    return res
      .status(404)
      .json({ message: "Failed to update user in the database" });
  }
};

/**
 * Delete user by `id` from the `User` table
 */
exports.deleteUserById = async function (req, res) {
  try {
    const { id } = req.params;
    await User.destroy({ where: { id: Number(id) } });

    return res.status(204).send();
  } catch (error) {
    console.log(`userController.deleteUserById: ${error}`);
    return res
      .status(404)
      .json({ message: "Failed to delete user from the database" });
  }
};
