const express = require('express');
const compilerController =require('../controllers/compilerController');
const router = express.Router();

router.post('/', compilerController.compileCode);

module.exports = router;