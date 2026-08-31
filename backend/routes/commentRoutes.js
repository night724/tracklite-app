const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const controller = require("../controllers/commentController");

router.use(authenticate);
router.get( "/issue/:issueId", controller.getComments );
router.post( "/", controller.createComment );
router.delete( "/:id", controller.deleteComment );

module.exports = router;