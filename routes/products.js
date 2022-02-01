var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET users listing. */
router.get('/', function (req, res, next) {
    db.query("SELECT * FROM products",
        (error, result) => {
            if (error) {
                res.json({ message: 'A MySql error occurred.' });
            }
            else {
                res.json(result);
            }
        }
    )
});

module.exports = router;
