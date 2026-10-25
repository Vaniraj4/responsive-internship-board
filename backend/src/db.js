const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "../internships.db");

const db = new Database(dbPath);

db.exec(`
    CREATE TABLE IF NOT EXISTS internships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        domain TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT,
        stipend TEXT,
        duration TEXT
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        internship_id INTEGER NOT NULL,
        applicant_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        cover_letter TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (internship_id) REFERENCES internships(id)
    )
`);


module.exports = db;