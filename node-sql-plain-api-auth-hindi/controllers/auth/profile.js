var jwt = require('jsonwebtoken');
const connection = require('../../sql');

module.exports = (req, res) => {
     
    // var temp = req.headers.authorization;
    // console.log(temp.split(" ")[1]);
    // var token;
    // try {
    //       token = req.headers.authorization.split(" ")[1];
    // } catch (error) {
    //     console.log(error);
    //     res.status(401).json({'error' : "Not Authenticated !"});
    // }
    
    // var decoded;
    // try {
    //     decoded = jwt.verify(token, 'secret');
    // } catch (error) {
    //     res.status(401).json({'error' : "Not Authenticated !"});
    // }

    connection.execute(
        'SELECT * FROM user WHERE `id` = ?',
        [req.uid],
        function (err, results, fields) {
            if (err) {
                res.status(500).json({ error: err });
            }
            if (results.length == 0) {
                // no user
                res.status(500).json({ error: "Unexpected Error" });
            } else {
                res.status(200).json(    results[0]  );
            }
        }
    );
}
