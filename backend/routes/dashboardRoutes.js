const express =
    require("express");


const router =
    express.Router();


const authenticate =
    require("../middleware/auth");


const controller =
    require("../controllers/dashboardController");
router.get(
    "/",
    authenticate,
    controller.getDashboard
);


router.get(
    "/charts",
    authenticate,
    controller.getCharts
);



module.exports =
    router;