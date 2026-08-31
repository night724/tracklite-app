require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT =
    process.env.PORT || 5000;

app.use(cors());

app.use(express.json());
const db = require("./config/database");
app.get("/", (req, res) => {
    res.json({
        message:
            "TrackLite API Running"
    });
}
);
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/issues", require("./routes/issueRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use( "/api/dashboard", require("./routes/dashboardRoutes"));

app.listen(
    PORT,
    () => {

        console.log(
            `TrackLite server running on port ${PORT}`
        );

    }
);