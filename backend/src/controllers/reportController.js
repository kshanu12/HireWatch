const { query } = require("express");
const db = require("../../config/database");

exports.addCandidateResponse = async function (req, res) {
  try {
    console.log(req.body);
    const candidateResponses = req.body.candidateResponse; // Extract the candidateResponse array from req.body

    await Promise.all(
      candidateResponses.map(async (response) => {
        const query = `
        INSERT INTO reports (application_id, question_id, option_id, is_correct)
        VALUES (${response.application_id}, ${response.question_id}, ${response.option_id}, ${response.is_correct});
      `;
        const candidateResponse = await db.query(query);
        // console.log("candidateResponse:", candidateResponse);
      })
    );

    return res
      .status(200)
      .json({ message: "Candidate responses added successfully" });
  } catch (error) {
    console.log(`addCandidateResponse: ${error}`);
    return res
      .status(403)
      .json({ message: "Failure adding candidate responses" });
  }
};

exports.getCandidateReport = async function (req, res) {
    try {
        const query = `Select * from reports where application_id=${req.params.id} order by option_id asc`;
        const [results] = await db.query(query)
        // console.log(results);

        return res
          .status(200)
          .json({ message: results });
      } catch (error) {
        console.log(`addCandidateResponse: ${error}`);
        return res
          .status(403)
          .json({ message: "Failure adding candidate responses" });
      }
}
