const { userdb, bookdb } = require("../model/model");
const jwt = require('jsonwebtoken');
//handle errors
const handleErrors = (err) => {
 
    let errors = {email: '', password: ''};
    //validation error
    if(err.message.includes('user1 validation failed')) {
        
        Object.values(err.errors).forEach(({properties})=>{ //get properties of each error
            errors[properties.path] = properties.message; 
        })
    }

    if(err.code==11000){
        errors.email='that email is already registered';
    }

     // login errors
    // incorrect email
    if(err.message === 'incorrect email'){
        errors.email = 'that email is not registered'
    }
    if(err.message === 'incorrect password'){
        
        errors.password = 'incorrect password'
    }
   
    return errors;

}

const maxAge = 3*24*60*60; // 3 days
//create jwt
const createToken = (email) => {
    return jwt.sign({email}, "", {
        expiresIn: maxAge
    });
}


module.exports.signup_get = (req, res) => {
    res.render('index');
}

module.exports.login_get = (req, res) => {
    res.render('index');
}

module.exports.signup_post = async (req,res) => {
    const { email,password } = req.body;
    try {
        const user = await userdb.create({email,password});
        const token = createToken(user.email);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
        res.status(201).json({user: user.email});
    } catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.login_post = async (req,res) => {
    const { email,password } = req.body;
    try {
        const user = await userdb.login(email,password);
        const token = createToken(user.email);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
        res.status(201).json({user: user.email});
    } catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}


module.exports.landing_get = (req, res) => {
    try {
        jwt.verify(req.cookies.jwt, "", async (err, decodedToken)=>{
            if(err){
                res.redirect('/');
            } else {
                bookdb.find({ email: { $eq: decodedToken.email } })
                .then((result)=>{
                    res.render('landing',{rating:result});
                })
            }
        })
    } catch (err) {
        res.redirect('/');
    }       
  };


  module.exports.logout_get = (req, res) => {
      res.cookie('jwt', '', {maxAge: 1});
      res.redirect('/');
  }

  module.exports.addRating =async (req, res) =>  {
    var decoded = jwt.verify(req.cookies.jwt, "");
   
    const rating = new bookdb({
        ISBN: req.body.ISBN,
        Book_Title: req.body.Book_Title,
        Book_Author: req.body.Book_Author,
        Year_of_Publication: req.body.Year_of_Publication,
        Publisher: req.body.Publisher,
        email: decoded.email,
        Book_Rating: req.body.Book_Rating,
      });

      rating
      .save(rating)
      .then((data) => {
        res.redirect('/landing');
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "An error occured while creating user",
        });
      });
  }