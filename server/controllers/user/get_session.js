module.exports = (function(req, res){

    req.session.user !== undefined ? res.status(200).json(req.session.user).end()
                                   : res.status(400).end();
});