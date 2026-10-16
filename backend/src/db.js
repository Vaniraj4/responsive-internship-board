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

module.exports = db;