const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const authenticate = require("../middleware/auth");

router.use( authenticate );

router.get( "/workspace/:workspaceId", projectController.getProjects );

router.get( "/:id", projectController.getProject );

router.post( "/", projectController.createProject );

router.patch( "/:id", projectController.updateProject );

router.delete( "/:id", projectController.deleteProject );

module.exports = router;