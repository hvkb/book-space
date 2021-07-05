const axios = require('axios');

exports.homeRoutes = (req, res) => {
    res.render("index");
}

exports.landing = (req, res) => {
    axios.get('http://localhost:3000/api/curruser',  {withCredentials: true})
    .then(result=>{
        res.render("landing", { rating: result.data })
    })
    .catch(err => {
        res.redirect("/");
    })
}

exports.addRating = (req, res) => {
    res.render("add_rating");
}

exports.basicSearch = (req, res) => {
    res.render("basic_search");
}

exports.logout = (req, res) => {
    res.render("index");
}

exports.advSearch = (req, res) => {
    res.render("advcrud");
}
 

exports.advSearchResults =(req,res)=>{
    axios.get('http://localhost:3000/api/advsearch',{ params: { title: req.query.title, author:req.query.author,year:req.query.year,limit:req.query.num } })
    .then(result=>{
        res.render("adv_search_results", { rating: result.data })
    })
}

exports.topRatedResults=(req,res)=>{
    axios.get('http://localhost:3000/api/average',{ params: { limit: req.query.limit } })
    .then(result=>{
        res.render("top_rated_results", { rating: result.data })
    }) 
}

exports.mostRatedResults=(req,res)=>{
    axios.get('http://localhost:3000/api/most-rated',{ params: { limit: req.query.limit } })
    .then(result=>{
        res.render("most_rated_results", { rating: result.data })
    }) 
}

