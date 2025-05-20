const db = require("../../config/database");

exports.getCandidateCodingResponse = async function (req, res) {
  try {
    const query = `SELECT * FROM coding_responses where application_id = ${req.params.id}`;
    const [results] = await db.query(query);

    return res.status(200).json({ message: results });
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Failed to fetch candidate coding response" });
  }
};

exports.addCandidateCodingResponse = async function (req, res) {
  try {
    console.log(req.body);
    const query = `INSERT INTO coding_responses(code, application_id) 
    VALUES ('${req.body.code}', ${req.body.application_id})`;
    console.log("====here====");

    const [result] = await db.query(query);
    console.log(result);
    return res.status(200).json({message: result});
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Failed to add candidate coding response" });
  }
};
