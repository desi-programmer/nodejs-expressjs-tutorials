var jwt = require('jsonwebtoken'); 
const connection = require('../../sql');

module.exports = (req, res, next) => { 
    var token;
    try {
        token = req.headers.authorization.split(" ")[1];
    } catch (error) {
        return res.status(401).json({'error' : "Not Authenticated !"});
    }

    var splitted = token.split("|");

    connection.execute(
        'SELECT * FROM tokens WHERE `id` = ? LIMIT 1',
        [splitted[0]],
        function (err, results, fields) {
            if (err) {
                return res.status(500).json({ error: err });
            }
            if (results.length == 0) {
                // no token
                return res.status(401).json({ error: "Not Authernticated" });
            }
            var decoded;
            try {
                decoded = jwt.verify(splitted[1], 'secret');
                console.log(decoded);
            } catch (error) {
                return res.status(401).json({'error' : "Not Authenticated !"});
            }
            req.uid = decoded.id;
            next();
    });
    
}
