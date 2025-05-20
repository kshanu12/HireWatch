const express = require("express");
const request = require("request");

exports.compileCode = async function (req, res) {
  try {
    const baseUrl = "https://api.jdoodle.com/v1/execute";
    const clientId = "1b265b965e016f2e22be2757dcba3431";
    const clientSecret =
      "32827fb6e0ea82c8a33d6456d264f653182f769ef5e63bfa03dd4c4d001167dd";
    const { script, language, stdin } = req.body;

    const program = {
      script,
      language,
      stdin,
      clientId,
      clientSecret,
    };
    console.log("======", program);

    request(
      {
        url: baseUrl,
        method: "POST",
        json: program,
      },
      function (error, response, body) {
        console.log("xxxxx", body);
        res.json(body);
      }
    );
  } catch (error) {
    return res.status(403).json({ message: "Failed to compile your code" });
  }
};
