var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET users listing. */
router.get('/', function (req, res, next) {
    db.query("SELECT de.*, u.username, p.name product_name, p.default_amount serving_size, mest.name measure, mt.name meal_type FROM diary_entries de JOIN users u ON de.user_id = u.user_id JOIN products p ON de.product_id = p.product_id JOIN measure_types mest ON p.measure_type_id = mest.measure_type_id JOIN meal_types mt ON de.meal_type_id = mt.meal_type_id",
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

router.get('/:id', function (req, res, next) {
    db.query("SELECT de.*, u.username, p.name product_name, p.default_amount serving_size, mest.name measure, mt.name meal_type FROM diary_entries de JOIN users u ON de.user_id = u.user_id JOIN products p ON de.product_id = p.product_id JOIN measure_types mest ON p.measure_type_id = mest.measure_type_id JOIN meal_types mt ON de.meal_type_id = mt.meal_type_id WHERE de.diary_entry_id = ?",
        [req.params.id],
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

router.get('/user/:user_id/date/:date', function (req, res, next) {
    db.query("SELECT de.*, u.username, p.name product_name, p.default_amount serving_size, (p.proteins * 4) + (p.carbs * 4) + (p.fats * 9) AS serving_calories, mest.name measure, mest.abbreviation measure_abbreviation, mt.name meal_type FROM diary_entries de JOIN users u ON de.user_id = u.user_id JOIN products p ON de.product_id = p.product_id JOIN measure_types mest ON p.measure_type_id = mest.measure_type_id JOIN meal_types mt ON de.meal_type_id = mt.meal_type_id WHERE de.user_id = ? AND DATE(de.datetime) = ?",
        [req.params.user_id, req.params.date],
        (error, result) => {
            if (error) {
                console.log(error);
                res.json({ message: 'A MySql error occurred.' });
            }
            else {
                res.json(result);
            }
        }
    )
});

router.post('/', function (req, res, next) {
    const { user_id, product_id, meal_type_id, amount, datetime } = req.body;
    console.log(req.body);
    db.query("INSERT INTO diary_entries (user_id, product_id, meal_type_id, amount, diary_entries.datetime) VALUES (?,?,?,?,DATE(?));",
        [user_id, product_id, meal_type_id, amount, datetime],
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
    const { diary_entry_id, amount } = req.body;
    console.log(req.body);
    db.query("UPDATE diary_entries SET amount = ? WHERE diary_entry_id = ?",
        [amount, diary_entry_id],
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
    db.query("DELETE FROM diary_entries WHERE diary_entry_id = ?",
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
