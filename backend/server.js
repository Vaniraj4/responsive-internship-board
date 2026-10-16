
const express = require("express");
const cors = require("cors");

const internshipRoutes = require("./src/routes/internships");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Internship API is running"
    });
});

app.use("/api/internships", internshipRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
