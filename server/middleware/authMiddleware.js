const jwt = require("jsonwebtoken");
var { bookdb } = require("../model/model");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "", (err, decodedToken) => {
      if (err) {
        res.redirect("/");
      } else {
        req.query = { ...req.query, email: decodedToken.email };
        next();
      }
    });
  } else {
    res.redirect("/"); //if user isnt logged in at all.
  }
};



module.exports = { requireAuth };
