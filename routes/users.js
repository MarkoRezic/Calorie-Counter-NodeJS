require('dotenv').config();
var express = require('express');
var router = express.Router();
var db = require('../db');
var jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

/* GET users listing. */
router.get('/', function (req, res, next) {
  db.query("SELECT u.*, r.name role, m.name model, g.name gender, w.calorie_diff weekly_calorie_diff, a.coefficient activity_coefficient FROM users u JOIN roles r ON u.role_id = r.role_id JOIN models m ON u.model_id = m.model_id JOIN genders g ON u.gender_id = g.gender_id JOIN weekly_goals w ON u.weekly_goal_id = w.weekly_goal_id JOIN activity_levels a ON u.activity_level_id = a.activity_level_id",
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
  db.query("SELECT u.*, r.name role, m.name model, g.name gender, w.calorie_diff weekly_calorie_diff, a.coefficient activity_coefficient FROM users u JOIN roles r ON u.role_id = r.role_id JOIN models m ON u.model_id = m.model_id JOIN genders g ON u.gender_id = g.gender_id JOIN weekly_goals w ON u.weekly_goal_id = w.weekly_goal_id JOIN activity_levels a ON u.activity_level_id = a.activity_level_id WHERE user_id = " + req.params.id,
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

router.post('/check', function (req, res, next) {
  const { username } = req.body;
  console.log(req.body);
  db.query("SELECT * FROM users WHERE LOWER(username) = '" + username.toLowerCase() + "'",
    (error, result) => {
      console.log(result);
      if (error) {
        console.log(error);
        res.json({ error: 2, message: 'A MySql error occurred.' });
      }
      else if (result.length > 0) {
        res.json({ error: 1, message: 'Korisničko ime je zauzeto.' });
      }
      else {
        res.json({ error: 0 });
      }
    }
  )
});

router.post('/register', function (req, res, next) {
  const { username, password, height, weight, goal_weight, age, gender_id, weekly_goal_id, activity_level_id } = req.body;
  console.log(req.body);
  db.query("INSERT INTO users (`username`, `password`, `role_id`, `height`, `weight`, `goal_weight`, `age`, `model_id`, `gender_id`, `weekly_goal_id`, `activity_level_id`) VALUES (?,?,1,?,?,?,?,1,?,?,?)",
    [username, password, height, weight, goal_weight, age, gender_id, weekly_goal_id, activity_level_id],
    (error, result) => {
      if (error) {
        console.log(error);
        res.json({ error: 2, message: 'A MySql error occurred.' });
      }
      else {
        res.json({ error: 0 });
      }
    }
  )
});

router.post('/login', function (req, res, next) {
  const { username, password } = req.body;
  console.log(req.body);
  db.query("SELECT u.*, r.name role, m.name model, g.name gender, w.calorie_diff weekly_calorie_diff, a.coefficient activity_coefficient FROM users u JOIN roles r ON u.role_id = r.role_id JOIN models m ON u.model_id = m.model_id JOIN genders g ON u.gender_id = g.gender_id JOIN weekly_goals w ON u.weekly_goal_id = w.weekly_goal_id JOIN activity_levels a ON u.activity_level_id = a.activity_level_id WHERE username = ? AND password = ?",
    [username, password],
    (error, result) => {
      if (error) {
        console.log(error);
        res.json({ error: 2, message: 'A MySql error occurred.' });
      }
      else if (result.length > 0) {
        res.json({ user: result[0], token: jwt.sign(result[0]["user_id"], JWT_SECRET), error: 0 });
      }
      else {
        res.json({ error: 1, message: 'Neispravni podaci.' });
      }
    }
  )
});

router.get('/token/:jwt', function (req, res, next) {
  const token = req.params.jwt;

  jwt.verify(token, JWT_SECRET, (error, user_id) => {
    console.log(error)

    if (error) {
      res.json({ error: 3, message: 'Neispravan jwt.' });
    }
    else {
      db.query("SELECT u.*, r.name role, m.name model, g.name gender, w.calorie_diff weekly_calorie_diff, a.coefficient activity_coefficient FROM users u JOIN roles r ON u.role_id = r.role_id JOIN models m ON u.model_id = m.model_id JOIN genders g ON u.gender_id = g.gender_id JOIN weekly_goals w ON u.weekly_goal_id = w.weekly_goal_id JOIN activity_levels a ON u.activity_level_id = a.activity_level_id WHERE u.user_id = ?",
        [user_id],
        (error, result) => {
          if (error) {
            console.log(error);
            res.json({ error: 2, message: 'A MySql error occurred.' });
          }
          else if (result.length > 0) {
            res.json({ user: result[0], error: 0 });
          }
          else {
            res.json({ error: 1, message: 'Korisnik nije pronađen.' });
          }
        }
      )
    }
  });
});

module.exports = router;
