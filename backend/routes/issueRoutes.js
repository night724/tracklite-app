const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const controller = require("../controllers/issueController");

router.use(authenticate);
router.get( "/task/:taskId", controller.getIssues );
router.get( "/:id", controller.getIssue );
router.post( "/", controller.createIssue );
router.patch( "/:id", controller.updateIssue );

module.exports = router;