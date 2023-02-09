var jwt = require('jsonwebtoken');
const connection = require('../../sql');

module.exports = (req, res, next) => {
    var token;
    try {
        token = req.headers.authorization.split(" ")[1];
    } catch (error) {
        return res.status(401).json({ 'error': "Not Authenticated !" });
    }

    var splitted = token.split("|");

    connection.execute(
        'DELETE FROM tokens WHERE `id` = ?',
        [splitted[0]],
        function (err, results, fields) {
            if (err) {
                res.status(500).json({ error: err });
            }
            return res.status(200).json({ 'message': 'Token deleted!' });
        });

}
