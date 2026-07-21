const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
app.use(express.static('public'));
// Database Connection
// ===============================
const connection = mysql.createConnection({
    host: 'c237-annie-mysql.mysql.database.azure.com',
    user: 'c237_020',
    password: 'c237020@2026!',
    database: 'c237_020_ca2team2',
    ssl: {
        rejectUnauthorized: false
    }
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});



// ===============================
// Express Settings
// ===============================
app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(express.urlencoded({
    extended: false
}));


// ===============================
// Session
// ===============================
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());


// ===============================
// Authentication Middleware
// ===============================
const checkAuthenticated = (req, res, next) => {

};

const checkAdmin = (req, res, next) => {

};


// ===============================
// HOME PAGE
// ===============================
app.get("/", (req, res) => {
    res.render("index", {
        user: req.session.user
    });
});


// ===================================================
// TIARA
// Registration/Login/Logout
// ===================================================

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const { username, password } = req.body;
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});


// ===================================================
// HARINI
// View Events
// ===================================================

app.get("/events", (req, res) => {
    const sql = `
SELECT
eventId,
eventName,
DATE_FORMAT(eventDate,'%d %b %Y') AS eventDate,
location,
description
FROM events
`;
    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.send("Database Error");
        }
        res.render("events", { events: results });
    });
});

app.get("/event/:id", (req, res) => {
    const id = req.params.id;
    const sql = `
SELECT
eventId,
eventName,
DATE_FORMAT(eventDate,'%d %b %Y') AS eventDate,
location,
description
FROM events
WHERE eventId = ?
`;
    connection.query(sql, [id], (err, results) => {
        if (err) {
            console.log(err);
            return res.send("Database Error");
        }
        if (results.length === 0) {
            return res.send("Event not found.");
        }
        res.render("event", { event: results[0] });
    });
});


// ===================================================
// JANELLE
// Add Event
// ===================================================

app.get("/addEvent", (req, res) => {
    res.render("addEvent");
});

app.post("/addEvent", (req, res) => {
    const {
        eventName,
        eventDate,
        location,
        description
    } = req.body;


    const sql = `
INSERT INTO events
(eventName, eventDate, location, description)
VALUES (?, ?, ?, ?)`;

    connection.query(
        sql,
        [eventName, eventDate, location, description],
        (err) => {

            if (err) {
                console.log(err);
                return res.send("Database Error");
            }

            res.redirect("/events");
        }
    );

});

// ===================================================
// CHLOE
// Edit Event
// ===================================================

// ===============================
// EDIT EVENT (Display Edit Form)
// ===============================
app.get("/editEvent/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
SELECT
eventId,
eventName,
DATE_FORMAT(eventDate,'%Y-%m-%d') AS eventDate,
location,
description
FROM events
WHERE eventId = ?
`;

    connection.query(sql, [id], (err, results) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        if (results.length === 0) {
            return res.send("Event not found.");
        }

        res.render("editEvent", {
            event: results[0]
        });

    });

});

// ===============================
// UPDATE EVENT
// ===============================
app.post("/editEvent/:id", (req, res) => {

    const id = req.params.id;

    const {
        eventName,
        eventDate,
        location,
        description
    } = req.body;

    const sql = `
UPDATE events
SET
    eventName=?,
    eventDate=?,
    location=?,
    description=?
WHERE eventId=?`;

    connection.query(
        sql,
        [
            eventName,
            eventDate,
            location,
            description,
            id
        ],
        (err) => {

            if (err) {
                console.log(err);
                return res.send("Database Error");
            }

            res.redirect("/events");
        }
    );

});

// ===================================================
// RONAN
// Delete Event
// Search Event
// ===================================================

app.get("/deleteEvent/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM events WHERE eventId = ?";
    connection.query(sql, [id], (err) => {
        if (err) {
            console.log(err);
            return res.send("Database Error");
        }
        res.redirect("/events");
    });
});

app.post("/deleteEvent/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM events WHERE eventId = ?";
    connection.query(sql, [id], (err) => {
        if (err) {
            console.log(err);
            return res.send("Database Error");
        }
        res.redirect("/events");
    });
});

app.get("/search", (req, res) => {
    const { query } = req.query;
    const sql = `
SELECT
eventId,
eventName,
DATE_FORMAT(eventDate,'%d %b %Y') AS eventDate,
location,
description
FROM events
WHERE eventName LIKE ?
OR description LIKE ?
`;
    connection.query(sql, [`%${query}%`, `%${query}%`], (err, results) => {
        if (err) {
            console.log(err);
            return res.send("Database Error");
        }
        res.render("events", { events: results });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));