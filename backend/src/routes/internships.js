
const express = require("express");
const db = require("../db");

const router = express.Router();

const requiredFields = ["title", "company", "domain", "location"];
const optionalFields = ["description", "stipend", "duration"];
const allowedFields = [...requiredFields, ...optionalFields];

// Validate internship request data
function validateInternship(body) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return "Request body must be a JSON object";
    }

    for (const field of requiredFields) {
        if (
            typeof body[field] !== "string" ||
            body[field].trim().length === 0
        ) {
            return `${field} is required and must be a non-empty string`;
        }

        if (body[field].trim().length > 200) {
            return `${field} must not exceed 200 characters`;
        }
    }

    for (const field of optionalFields) {
        if (body[field] !== undefined && typeof body[field] !== "string") {
            return `${field} must be a string`;
        }

        if (typeof body[field] === "string" && body[field].length > 2000) {
            return `${field} must not exceed 2000 characters`;
        }
    }

    const unknownFields = Object.keys(body).filter(
        field => !allowedFields.includes(field)
    );

    if (unknownFields.length > 0) {
        return `Unknown field(s): ${unknownFields.join(", ")}`;
    }

    return null;
}

// Validate positive integer IDs
function getValidId(value) {
    if (!/^[1-9]\d*$/.test(value)) {
        return null;
    }

    const id = Number(value);
    return Number.isSafeInteger(id) ? id : null;
}

// Standard server-error response
function handleError(res, operation, error) {
    console.error(`[API ERROR] ${operation}:`, error.message);

    return res.status(500).json({
        success: false,
        error: `Failed to ${operation}`
    });
}

// GET all internships with pagination
router.get("/", (req, res) => {
    try {
        let page = 1;
        let limit = 10;

        if (req.query.page !== undefined) {
            if (!/^[1-9]\d*$/.test(req.query.page)) {
                return res.status(400).json({
                    success: false,
                    error: "Page must be a positive integer"
                });
            }
            page = Number(req.query.page);
        }

        if (req.query.limit !== undefined) {
            if (!/^[1-9]\d*$/.test(req.query.limit)) {
                return res.status(400).json({
                    success: false,
                    error: "Limit must be a positive integer"
                });
            }
            limit = Number(req.query.limit);
        }

        if (
            !Number.isSafeInteger(page) ||
            !Number.isSafeInteger(limit) ||
            limit > 50
        ) {
            return res.status(400).json({
                success: false,
                error: "Page must be a safe positive integer and limit must be between 1 and 50"
            });
        }

        const offset = (page - 1) * limit;

        if (!Number.isSafeInteger(offset)) {
            return res.status(400).json({
                success: false,
                error: "Requested page is too large"
            });
        }

        const totalResult = db
            .prepare("SELECT COUNT(*) AS total FROM internships")
            .get();

        const internships = db.prepare(`
            SELECT *
            FROM internships
            ORDER BY id DESC
            LIMIT ? OFFSET ?
        `).all(limit, offset);

        res.status(200).json({
            success: true,
            data: internships,
            pagination: {
                page,
                limit,
                total: totalResult.total,
                totalPages: Math.ceil(totalResult.total / limit)
            }
        });
    } catch (error) {
        return handleError(res, "fetch internships", error);
    }
});

// GET one internship
router.get("/:id", (req, res) => {
    try {
        const id = getValidId(req.params.id);

        if (id === null) {
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

        return res.status(200).json({
            success: true,
            data: internship
        });
    } catch (error) {
        return handleError(res, "fetch internship", error);
    }
});

// POST create internship
router.post("/", (req, res) => {
    try {
        const validationError = validateInternship(req.body);

        if (validationError) {
            return res.status(400).json({
                success: false,
                error: validationError
            });
        }

        const {
            title, company, domain, location,
            description = "", stipend = "", duration = ""
        } = req.body;

        const result = db.prepare(`
            INSERT INTO internships
            (title, company, domain, location, description, stipend, duration)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
            title.trim(),
            company.trim(),
            domain.trim(),
            location.trim(),
            description,
            stipend,
            duration
        );

        const newInternship = db
            .prepare("SELECT * FROM internships WHERE id = ?")
            .get(result.lastInsertRowid);

        return res.status(201).json({
            success: true,
            message: "Internship created successfully",
            data: newInternship
        });
    } catch (error) {
        return handleError(res, "create internship", error);
    }
});

// PUT update internship (full replacement of editable fields)
router.put("/:id", (req, res) => {
    try {
        const id = getValidId(req.params.id);

        if (id === null) {
            return res.status(400).json({
                success: false,
                error: "Invalid internship ID"
            });
        }

        const validationError = validateInternship(req.body);

        if (validationError) {
            return res.status(400).json({
                success: false,
                error: validationError
            });
        }

        const existing = db
            .prepare("SELECT id FROM internships WHERE id = ?")
            .get(id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                error: "Internship not found"
            });
        }

        const {
            title, company, domain, location,
            description = "", stipend = "", duration = ""
        } = req.body;

        db.prepare(`
            UPDATE internships
            SET title = ?, company = ?, domain = ?, location = ?,
                description = ?, stipend = ?, duration = ?
            WHERE id = ?
        `).run(
            title.trim(),
            company.trim(),
            domain.trim(),
            location.trim(),
            description,
            stipend,
            duration,
            id
        );

        const updatedInternship = db
            .prepare("SELECT * FROM internships WHERE id = ?")
            .get(id);

        return res.status(200).json({
            success: true,
            message: "Internship updated successfully",
            data: updatedInternship
        });
    } catch (error) {
        return handleError(res, "update internship", error);
    }
});

// DELETE internship
router.delete("/:id", (req, res) => {
    try {
        const id = getValidId(req.params.id);

        if (id === null) {
            return res.status(400).json({
                success: false,
                error: "Invalid internship ID"
            });
        }

        const result = db
            .prepare("DELETE FROM internships WHERE id = ?")
            .run(id);

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                error: "Internship not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Internship deleted successfully"
        });
    } catch (error) {
        return handleError(res, "delete internship", error);
    }
});

module.exports = router;
