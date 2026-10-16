# Internship Board REST API

## Overview
A REST API built with Node.js, Express.js, and SQLite to manage internship records.

## Technologies Used
- Node.js
- Express.js
- SQLite with better-sqlite3
- CORS
- Postman for API testing

## Setup Instructions

Open a terminal inside the `backend` folder and run:

```bash
npm install
node server.js
```

The API runs at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/internships` | List internships |
| GET | `/api/internships/:id` | Get an internship by ID |
| POST | `/api/internships` | Create an internship |
| PUT | `/api/internships/:id` | Update an internship |
| DELETE | `/api/internships/:id` | Delete an internship |

The list endpoint supports pagination.

## Database and Sample Data

The project uses SQLite. The `src/db.js` file creates the database table, and `src/seed.js` contains five sample internship records.

To insert sample records into an empty database, run this command from the `backend` folder:

```bash
node src/seed.js
```

## Testing

Use Postman to test the endpoints and check successful responses, validation errors, and missing records.

## Author
Vani Raj
