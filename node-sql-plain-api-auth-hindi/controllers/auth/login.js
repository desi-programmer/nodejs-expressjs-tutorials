const { validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
const connection = require('../../sql');
var jwt = require('jsonwebtoken');

module.exports = (req, res) => {
    const errors = validationResult(req);
    // TODO : Customize Error Message
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // check email already exists ?
    const { email, password } = req.body;
    connection.execute(
        'SELECT * FROM user WHERE `email` = ? LIMIT 1',
        [email],
        function (err, results, fields) {
            if (err) {
                res.status(500).json({ error: err });
            }
            if (results.length == 0) {
                // no user
                res.status(400).json({ error: "No User exists" });
            } else {
                //   validate password
                var hashresult = bcrypt.compareSync(password, results[0].password);
                if (hashresult) {
                    //
                    var token = jwt.sign({ id: results[0].id, exp: Math.floor(Date.now() / 1000) + (1000), }, 'secret');
                    // add to database
                    connection.execute(
                        'INSERT INTO tokens(token,uid) VALUES(?,?)',
                        [token, results[0].id],
                        function (err, results, fields) {
                            if (err) {
                                res.status(500).json({ error: err });
                            }
                            if (results.length == 0) {
                                res.status(500).json({ error: "Some Issues" });
                            }
                            var data = results.insertId + "|" + token;
                            res.json(data);
                        }
                        );
                } else {
                    res.status(400).json({ error: "Invalid Credentials !" });
                }
            }
        }
    );

}