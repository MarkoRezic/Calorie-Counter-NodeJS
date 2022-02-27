var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET users listing. */
router.get('/', function (req, res, next) {
    db.query(req.query.search ? ("SELECT p.*, mt.name measure, (p.proteins * 4) + (p.carbs * 4) + (p.fats * 9) AS serving_calories, mt.abbreviation measure_abbreviation FROM products p JOIN measure_types mt ON p.measure_type_id = mt.measure_type_id WHERE p.name LIKE '%" + req.query.search + "%'")
        : "SELECT p.*, mt.name measure, (p.proteins * 4) + (p.carbs * 4) + (p.fats * 9) AS serving_calories, mt.abbreviation measure_abbreviation FROM products p JOIN measure_types mt ON p.measure_type_id = mt.measure_type_id",
        (error, result) => {
            if (error) {
                console.log(error);
                res.json({ error: 1, message: 'A MySql error occurred.' });
            }
            else {
                res.json(result);
            }
        }
    )
});

router.get('/history/:ids', function (req, res, next) {
    db.query("SELECT p.*, mt.name measure, (p.proteins * 4) + (p.carbs * 4) + (p.fats * 9) AS serving_calories, mt.abbreviation measure_abbreviation FROM products p JOIN measure_types mt ON p.measure_type_id = mt.measure_type_id WHERE p.product_id IN (" + req.params.ids + ")",
        (error, result) => {
            if (error) {
                console.log(error);
                res.json({ error: 1, message: 'A MySql error occurred.' });
            }
            else {
                res.json(result);
            }
        }
    )
});

router.get('/:id', function (req, res, next) {
    db.query("SELECT p.*, mt.name measure, (p.proteins * 4) + (p.carbs * 4) + (p.fats * 9) AS serving_calories, mt.abbreviation measure_abbreviation FROM products p JOIN measure_types mt ON p.measure_type_id = mt.measure_type_id WHERE p.product_id = " + req.params.id,
        (error, result) => {
            if (error) {
                console.log(error);
                res.json({ error: 1, message: 'A MySql error occurred.' });
            }
            else {
                res.json(result);
            }
        }
    )
});

module.exports = router;
