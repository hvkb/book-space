const express = require('express');
const route = express.Router()   
const controller = require('../controller/controller');
const authController = require('../controller/authController');
const services = require('../services/render');
const {requireAuth} = require('../middleware/authMiddleware');


route.get('/landing', requireAuth, authController.landing_get)
route.get('/', authController.signup_get); 
route.post('/signup', authController.signup_post);
route.post('/login', authController.login_post);
route.get('/logout', authController.logout_get);
route.post('/api/addrating', authController.addRating);


route.get('/add-rating', requireAuth,services.addRating)
route.get('/rating-details',requireAuth,controller.isbn)
route.get('/basic-search', services.basicSearch)

route.get('/update-rating', controller.findReview)

route.get('/adv-search', services.advSearch)
route.get('/adv-search-results',services.advSearchResults)
route.get('/top-rating-results',services.topRatedResults);
route.get('/most-rated-results',services.mostRatedResults);


 

route.get('/api/average', controller.average);
route.get('/api/most-rated',controller.mostrated);


route.put('/api/update/:id', controller.update);
route.get('/api/getbook',controller.isbn);
route.get('/api/addrating', controller.addrating);
route.delete('/api/delete/:id', controller.delete);
route.get('/api/advsearch', controller.advsearch);
route.get('/api/findreview',controller.findReview);



route.use((req,res)=>{ 
    res.render('404');
})

module.exports = route

