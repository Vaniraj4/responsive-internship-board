const express = require("express");
const db = require("../db");

const router = express.Router();

// GET all internships with pagination
router.get("/", (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

        const offset = (page - 1) * limit;

        const totalResult = db
            .prepare("SELECT COUNT(*) AS total FROM internships")
            .get();

        const internships = db
            .prepare(`
                SELECT *
                FROM internships
                ORDER BY id DESC
                LIMIT ? OFFSET ?
            `)
            .all(limit, offset);

        res.status(200).json({
            success: true,
            data: internships,
            pagination: {
                page: page,
                limit: limit,
                total: totalResult.total,
                totalPages: Math.ceil(totalResult.total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to fetch internships"
        });
    }
});


// GET one internship by ID
router.get("/:id", (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                success: false,
                error: "Invalid internship ID"
            });
        }

        const internship = db
            .prepare("SELECT * FROM internships WHERE id = ?")
            .get(id);

        if (!internship) {
            return res.status(404).json({
                success: false,
                error: "Internship not found"
            });
        }

        res.status(200).json({
            success: true,
            data: internship
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to fetch internship"
        });
    }
});


// POST create internship
router.post("/", (req, res) => {
    try {
        const {
            title,
            company,
            domain,
            location,
            description,
            stipend,
            duration
        } = req.body;

        if (!title || !company || !domain || !location) {
            return res.status(400).json({
                success: false,
                error: "Title, company, domain, and location are required"
            });
        }

        const result = db
            .prepare(`
                INSERT INTO internships
                (title, company, domain, location, description, stipend, duration)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `)
            .run(
                title,
                company,
                domain,
                location,
                description || "",
                stipend || "",
                duration || ""
            );

        const newInternship = db
            .prepare("SELECT * FROM internships WHERE id = ?")
            .get(result.lastInsertRowid);

        res.status(201).json({
            success: true,
            message: "Internship created successfully",
            data: newInternship
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to create internship"
        });
    }
});


// PUT update internship
router.put("/:id", (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                success: false,
                error: "Invalid internship ID"
            });
        }

        const existing = db
            .prepare("SELECT * FROM internships WHERE id = ?")
            .get(id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                error: "Internship not found"
            });
        }

        const {
            title,
            company,
            domain,
            location,
            description,
            stipend,
            duration
        } = req.body;

        if (!title || !company || !domain || !location) {
            return res.status(400).json({
                success: false,
                error: "Title, company, domain, and location are required"
            });
        }

        db.prepare(`
            UPDATE internships
            SET
                title = ?,
                company = ?,
                domain = ?,
                location = ?,
                description = ?,
                stipend = ?,
                duration = ?
            WHERE id = ?
        `).run(
            title,
            company,
            domain,
            location,
            description || "",
            stipend || "",
            duration || "",
            id
        );

        const updatedInternship = db
            .prepare("SELECT * FROM internships WHERE id = ?")
            .get(id);

        res.status(200).json({
            success: true,
            message: "Internship updated successfully",
            data: updatedInternship
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to update internship"
        });
    }
});


// DELETE internship
router.delete("/:id", (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                success: false,
                error: "Invalid internship ID"
            });
        }

        const existing = db
            .prepare("SELECT * FROM internships WHERE id = ?")
            .get(id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                error: "Internship not found"
            });
        }

        db.prepare("DELETE FROM internships WHERE id = ?").run(id);

        res.status(200).json({
            success: true,
            message: "Internship deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to delete internship"
        });
    }
});


module.exports = router;