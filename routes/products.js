var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET users listing. */
router.get('/', function (req, res, next) {
    db.query(req.query.search ? ("SELECT p.*, mt.name measure, (p.proteins * 4) + (p.carbs * 4) + (p.fats * 9) AS serving_calories, mt.abbreviation measure_abbreviation FROM products p JOIN measure_types mt ON p.measure_type_id = mt.measure_type_id WHERE p.name LIKE '%" + req.query.search + "%'")
        : req.query.barcode ? ("SELECT p.*, mt.name measure, (p.proteins * 4) + (p.carbs * 4) + (p.fats * 9) AS serving_calories, mt.abbreviation measure_abbreviation FROM products p JOIN measure_types mt ON p.measure_type_id = mt.measure_type_id WHERE p.barcode = '" + req.query.barcode + "'")
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

router.post('/', function (req, res, next) {
    const { name, default_amount, measure_type_id, barcode, proteins, carbs, fats, sugars, fibers, salt, calcium, iron } = req.body;
    console.log(req.body);
    db.query("INSERT INTO products (name, default_amount, measure_type_id, barcode, proteins, carbs, fats, sugars, fibers, salt, calcium, iron) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);",
        [name, default_amount, measure_type_id, barcode, proteins, carbs, fats, sugars, fibers, salt, calcium, iron],
        (error, result) => {
            if (error) {
                console.log(error);
                res.json({ error: 1, message: 'A MySql error occurred.' });
            }
            else {
                res.json({ error: 0 });
            }
        }
    )
});

router.put('/', function (req, res, next) {
    const { product_id, name, default_amount, measure_type_id, barcode, proteins, carbs, fats, sugars, fibers, salt, calcium, iron } = req.body;
    console.log(req.body);
    db.query("UPDATE products SET name = ?, default_amount = ?, measure_type_id = ?, barcode = ?, proteins = ?, carbs = ?, fats = ?, sugars = ?, fibers = ?, salt = ?, calcium = ?, iron = ? WHERE product_id = ?",
        [name, default_amount, measure_type_id, barcode, proteins, carbs, fats, sugars, fibers, salt, calcium, iron, product_id],
        (error, result) => {
            if (error) {
                console.log(error);
                res.json({ error: 1, message: 'A MySql error occurred.' });
            }
            else {
                res.json({ error: 0 });
            }
        }
    )
});

router.delete('/:id', function (req, res, next) {
    db.query("DELETE FROM products WHERE product_id = ?",
        [req.params.id],
        (error, result) => {
            if (error) {
                console.log(error);
                res.json({ error: 1, message: 'A MySql error occurred.' });
            }
            else {
                res.json({ error: 0 });
            }
        }
    )
});

module.exports = router;
