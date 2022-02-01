var express = require('express');
var router = express.Router();
var db = require('../db');

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

module.exports = router;
