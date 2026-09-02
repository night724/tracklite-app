const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticate = require("../middleware/auth");
const authMiddleware = require("../middleware/auth");

router.post(
    "/register",
    authController.register
);

router.post(
    "/login",
    authController.login
);

router.get(
    "/me",
    authenticate,
    authController.me
);

router.put(
    "/change-password",
    authMiddleware,
    authController.changePassword
);
router.put(
    "/profile",
    authMiddleware,
    authController.updateProfile
);
module.exports = router;