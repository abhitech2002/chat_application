const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");
const userController = require("../controllers/userController");

// Create a variable to store blacklisted tokens
const blacklistedTokens = new Set();

router.post("/login", catchErrors(userController.login));
router.post("/register", catchErrors(userController.register));


module.exports = router;
