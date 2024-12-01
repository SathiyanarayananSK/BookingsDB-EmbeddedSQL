//Using express framework to host the webpage
let express = require('express');
let app = express();
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const mysql = require('mysql2');

//Setting port number to 3000
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }
    return false;
}

app.use(express.static('Public'));
//Parse URL encoded data from HTTP
app.use(express.urlencoded({ extended: false }));

// Connecting to the MySQL database
const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    password: 'mysqlpwd', 
    database: 'bookings_com_db', 
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database as ID ' + db.threadId);
});

app.post('/submit', (req, res) => {
    const { fname, lname, phone, email, ccrd, cexp } = req.body;

    const insertQuery = `INSERT INTO CUSTOMER (CUST_FNAME, CUST_LNAME, CUST_PHONE, CUST_EMAIL, CUST_CREDIT_CARD, CUST_CREDIT_EXP) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [fname, lname, phone, email, ccrd, cexp];

    db.query(insertQuery, values, (err, result) => {
        if (err) {
            console.error('Error inserting data: ' + err);
            return res.status(500).send('Error inserting data');
        }
        console.log('Data inserted successfully');
        res.send('Data inserted successfully');
    });
});


app.listen(port, function () {
    console.log(`Web server running at: http://localhost:${port}`)
    console.log("Type Ctrl+C to shut down the web server")
})
