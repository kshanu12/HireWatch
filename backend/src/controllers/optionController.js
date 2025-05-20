const {
    Test,
    Question,
    Option,
} = require("../models/models");

/**
 * Fetch all the options for a particular question id
 */
exports.getAllOptionsByQuestionId = async function (req, res) {
    try {
        const { id } = req.params;

        const allOptions = await Option.findAll({
            where: { question_id: Number(id) },
        });

        res.json(allOptions);
    } catch (error) {
        console.log(`optionController.getAllOptionsByQuestionId: ${error}`);
        res.json({ message: "Failure getting options by question id" });
    }
};

/**
* Fetch all the options in the `Option` table
*/
exports.getAllOptions = async function (req, res) {
    try {
        const allOptions = await Option.findAll();
        res.json(allOptions);
    } catch (error) {
        console.log(`optionController.getAllOptions: ${error}`);
        res.json({ message: "Failure getting options" });
    }
};

/**
* Add a field in the `Option` table. The request body will usually contain the
* following fields:
*  - description
*  - is_answer
*  - question_id? (foreign key to the `Question` table)
*/
exports.createOption = async function (req, res) {
    try {
        const { description, is_answer, question_id } = req.body;
        const optionData = { description, is_answer };

        if (question_id) {
            const question = await Question.findByPk(question_id);
            if (!question) {
                throw new Error(`Question with ID ${question_id} not found.`);
            }
            optionData.question_id = question.id;
            console.log(optionData)
        }

        const option = await Option.create(
            optionData
            );
        res.json(option);
    } catch (error) {
        console.log(`optionController.createOption: ${error}`);
        res.json({ message: "Failure adding option" });
    }
};

/**
* Performs an update on the `Option` table. Request body will usually contain
* the following fields:
*  - description?
*  - is_answer?
*  - question?
*/


exports.updateOption = async function (req, res) {
    const { id } = req.params;
    const { description, is_answer, question_id } = req.body;

    try {
        const existingOption = await Option.findByPk(id);

        if (!existingOption) {
            return res.status(404).json({ error: "Option not found" });
        }

        const updatedOptionData = {
            description: description || existingOption.description,
            is_answer: is_answer || existingOption.is_answer,
        };

        if (question_id) {
            const question = await Question.findByPk(question_id);
            if (!question) {
                throw new Error(`Question with ID ${question_id} not found.`);
            }
            updatedOptionData.question_id = question_id;
        }

        const updatedOption = await existingOption.update(updatedOptionData);
        res.json(updatedOption);
    } catch (error) {
        console.log(`optionController.updateOption: ${error}`);
        res.json({ message: "Failure updating option" });
    }
};

/**
* Delete an existing option based on its id
*/
exports.deleteOptionById = async function (req, res) {
    try {
        const { id } = req.params;

        const deletedOption = await Option.destroy({
            where: { id: Number(id) },
        });

        if (deletedOption === 0) {
            return res.status(404).json({ error: "Option not found" });
        }

        res.json({ message: "Option deleted successfully" });
    } catch (error) {
        console.log(`optionController.deleteOptionById: ${error}`);
        res.json({ message: "Failure deleting option" });
    }
};

/**
* Deletes all options for the question_id
*/
exports.deleteOptionsByQuestionId = async function (req, res) {
    try {
        const { id } = req.params;

        const deletedOptions = await Option.destroy({
            where: { question_id: Number(id) },
        });

        res.json(deletedOptions);
    } catch (error) {
        console.log(`optionController.deleteOptionsByQuestionId: ${error}`);
        res.json({ message: "Failure deleting options by question id" });
    }
};