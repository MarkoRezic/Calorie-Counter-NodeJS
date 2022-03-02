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
    db.query("SELECT de.*, u.username, p.name product_name, p.default_amount serving_size, (p.proteins * 4) + (p.carbs * 4) + (p.fats * 9) AS serving_calories, ROUND(p.proteins * de.amount,1) as proteins, ROUND(p.carbs * de.amount,1) as carbs, ROUND(p.fats * de.amount,1) as fats, ROUND(p.sugars * de.amount,1) as sugars, ROUND(p.fibers * de.amount,1) as fibers, ROUND(p.salt * de.amount,1) as salt, ROUND(p.calcium * de.amount,1) as calcium, ROUND(p.iron * de.amount,1) as iron, mest.name measure, mest.abbreviation measure_abbreviation, mt.name meal_type FROM diary_entries de JOIN users u ON de.user_id = u.user_id JOIN products p ON de.product_id = p.product_id JOIN measure_types mest ON p.measure_type_id = mest.measure_type_id JOIN meal_types mt ON de.meal_type_id = mt.meal_type_id WHERE de.user_id = ? AND DATE(de.datetime) = ?",
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

router.get('/progress/:user_id/period/:period_type', function (req, res, next) {
    let query_string = req.params.period_type == "week" ? "SELECT de.datetime, SUM(ROUND(((p.proteins * 4) + (p.carbs * 4) + (p.fats * 9)) * de.amount)) AS total_calories FROM diary_entries de JOIN users u ON de.user_id = u.user_id JOIN products p ON de.product_id = p.product_id WHERE de.user_id = ? AND DATE(de.datetime) >= DATE_SUB(NOW(), INTERVAL 7 DAY) GROUP BY DATE(de.datetime) ORDER BY de.datetime;"
        : req.params.period_type == "month" ? "SELECT FROM_DAYS(TO_DAYS(de.datetime) -MOD(TO_DAYS(de.datetime) -2, 7)) AS week_start, SUM(ROUND(((p.proteins * 4) + (p.carbs * 4) + (p.fats * 9)) * de.amount)) AS total_calories FROM diary_entries de JOIN users u ON de.user_id = u.user_id JOIN products p ON de.product_id = p.product_id WHERE de.user_id = ? AND DATE(de.datetime) >= DATE_SUB(NOW(), INTERVAL 1 MONTH) GROUP BY FROM_DAYS(TO_DAYS(de.datetime) -MOD(TO_DAYS(de.datetime) -2, 7)) ORDER BY week_start;"
            : req.params.period_type == "year" ? "SELECT DATE_FORMAT(de.datetime, '%Y-%m-01') AS month_start, SUM(ROUND(((p.proteins * 4) + (p.carbs * 4) + (p.fats * 9)) * de.amount)) AS total_calories FROM diary_entries de JOIN users u ON de.user_id = u.user_id JOIN products p ON de.product_id = p.product_id WHERE de.user_id = ? AND DATE(de.datetime) >= DATE_SUB(NOW(), INTERVAL 1 YEAR) GROUP BY DATE_FORMAT(de.datetime, '%Y-%m-01') ORDER BY month_start;"
                : "SELECT YEAR(DATE_FORMAT(de.datetime, '%Y-01-01')) AS year_start, SUM(ROUND(((p.proteins * 4) + (p.carbs * 4) + (p.fats * 9)) * de.amount)) AS total_calories FROM diary_entries de JOIN users u ON de.user_id = u.user_id JOIN products p ON de.product_id = p.product_id WHERE de.user_id = ? AND DATE(de.datetime) >= DATE_SUB(NOW(), INTERVAL 5 YEAR) GROUP BY YEAR(DATE_FORMAT(de.datetime, '%Y-01-01')) ORDER BY year_start;"
    db.query(query_string,
        [req.params.user_id],
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

module.exports = router;
