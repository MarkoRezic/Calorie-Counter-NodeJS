var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET attributes listing. */
router.get('/', function (req, res, next) {
    res.json({ message: "attributes route" });
});

router.get('/models/', function (req, res, next) {
    db.query("SELECT * FROM models",
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

router.get('/genders/', function (req, res, next) {
    db.query("SELECT * FROM genders",
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

router.get('/weekly_goals/', function (req, res, next) {
    db.query("SELECT * FROM weekly_goals",
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

router.get('/weekly_goals/:goal', function (req, res, next) {
    db.query("SELECT * FROM weekly_goals WHERE calorie_diff " + (req.params.goal == 1 ? "<" : req.params.goal == 2 ? "=" : ">") + " 0",
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

router.get('/activity_levels/', function (req, res, next) {
    db.query("SELECT * FROM activity_levels",
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

router.get('/measure_types/', function (req, res, next) {
    db.query("SELECT * FROM measure_types",
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

router.get('/meal_types/', function (req, res, next) {
    db.query("SELECT * FROM meal_types",
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
