const { validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
const connection = require('../../sql');

module.exports = (req, res) => {
    const errors = validationResult(req);
    // TODO : Customize Error Message
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // check email already exists ?
    const { email, password } = req.body;
    connection.execute(
        'SELECT * FROM user WHERE `email` = ?',
        [email],
        function (err, results, fields) {
            if (err) {
                res.status(500).json({ error: err });
            }
            if (results.length == 0) {
                // no user
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(password, salt);
                connection.execute(
                    'INSERT INTO user (email,password) VALUES(?,?)',
                    [email, hash],
                    function (err, results, fields) {
                        if (err) {
                            res.status(500).json({ error: err });
                        }
                        res.status(200).json({ success: "User Created" });
                    }
                );
            } else {
                res.status(400).json({ error: "User exists" });
            }
        }
    );

}