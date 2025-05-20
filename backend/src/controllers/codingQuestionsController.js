const db = require("../../config/database");

exports.getCodingQuestionByTestId = async function (req, res) {
  try {
    const { id } = req.params;

    let query = `
            SELECT c.id as coding_id, 
                   c.description as coding_description,
                   c.input as coding_input, 
                   c.output as coding_output, 
                   c.marks as coding_marks, 
                   c.test_id as coding_test_id,
                   t.name as test_name,
                   t.duration as test_duration,
                   t.score as test_score,
                   t.type as test_type,
                   t.creator_id as test_creator,
                   ts.name as tech_stack_name

            FROM coding_questions c, tests t, tech_stacks ts
            WHERE c.test_id = t.id and t.tech_stack_id = ts.id
        `;

    const [results] = await db.query(query);
    return res.status(200).json({ message: results });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Unable to fetch coding questions" });
  }
};

exports.createCodingQuestion = async function (req, res) {
  try {
    const { description, input, output, marks, test_id } = req.body;
    const query = `
    INSERT INTO coding_questions(description, input, output, marks, test_id)
    VALUES ('${description}', '${input}', '${output}', ${marks}, ${test_id});
    `;

    const data = await db.query(query);
    return res.status(200).json({ message: "Record inserted successfully" });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Failed to create coding question" });
  }
};
