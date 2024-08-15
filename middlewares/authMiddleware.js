// middlewares/authMiddleware.js
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/dash-bca/login');
}

module.exports = { ensureAuthenticated };
