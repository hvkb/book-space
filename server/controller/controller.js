var { userdb, bookdb } = require("../model/model");

exports.create = (req, res) => {
  //validate req
  if (!req.query) {
    res.status(400).send({ message: "Content can't be empty." });
    return;
  }

  //new user
  const user = new userdb({
    User_ID: req.query.User_ID,
  });
  
  //saving user in db
  user
    .save(user)
    .then((data) => {
      res.redirect('/landing?userid='+user.User_ID);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "An error occured while creating user",
      });
    });
}; 

exports.average = (req, res) => {
  const limit=parseInt(req.query.limit)
  bookdb
    .aggregate([
      {$group: { _id: {Book_Title: "$Book_Title", ISBN: "$ISBN", Publisher: "$Publisher", Author:"$Book_Author"},
       average: {$avg: "$Book_Rating"}}},
      {$sort: { average: -1 }},
      {$limit:limit}
    ]).then(data=>{
      res.send(data)
  }).catch((err) => {
      res
        .status(500)
        .send({
          message:
            err.message || "Error occured while retrieving user information",
        });
    });
};

exports.mostrated = (req, res) => {
  const limit=parseInt(req.query.limit)
  bookdb
    .aggregate([
      {$group: { _id: {Book_Title: "$Book_Title", ISBN: "$ISBN", Publisher: "$Publisher", Author:"$Book_Author"},
       count: {$sum: 1}}},
      {$sort: { count: -1 }},
      {$limit:limit}
    ]).then(data=>{
      res.send(data)
  }).catch((err) => {
      res
        .status(500)
        .send({
          message:
            err.message || "Error occured while retrieving user information",
        });
    });
};

exports.advsearch = (req, res) => {
  let input = req.query;
  
  let filters = {};
  let limit = input.limit == '' ? 10 : parseInt(input.limit);
  if (input.year != '') {
    filters = { ...filters, Year_of_Publication: { $eq: input.year } };
  }
  if (input.author != "") {
    filters = {
      ...filters,
      Book_Author: { $regex: new RegExp(input.author, "i") },
    };
  }
  if (input.title != "") {
    filters = {
      ...filters,
      Book_Title: { $regex: new RegExp(input.title, "i") },
    };
  }
  

  bookdb
    .find(filters)
    .limit(limit)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving" + err });
    });
};

exports.curruser = (req, res) => {
  if (req.query.id) {
    const id = req.query.id;
    bookdb
      .find({ User_ID: { $eq: id } })
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: "Error retrieving user with id " + id });
      });
  } 
 
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update cannot be empty" });
  }


  const id = req.params.id;
 
  bookdb
    .findByIdAndUpdate(id, req.body, { useFindAndModify: true })
    .then(data => {
      
       res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: "Error updating user information" });
    })
}


exports.delete=(req,res)=>{
        const id=req.params.id;
        bookdb.findByIdAndDelete(id)
        .then(data=>{
            if(!data){
                res.status(404).send({message: `Cannot delete, Maybe review is unavailable`})
            }else{
                res.send({
                    message:"Review was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({ 
                message:"Could not delete Review, id not found."
            });
        });
};


  

exports.isbn = (req, res) => {
  if (!req.query) {
    res.status(400).send({ message: "Content can't be empty." });
    return;
  }
  if (req.query.id) {
    const id = req.query.id;
  bookdb
  .find(
      {$and:[ {'email': req.query.email}, {'ISBN':parseInt(req.query.id)} ]}
      )
  .then(result=>{
      if(result.length>0){ //if rating exists already: 
        res.redirect('/add-rating?error='+"rating_already_exists");
       
      } else {
        bookdb
        .find({ ISBN: { $eq: id } })
        .then((bookdetails) => {
          if(bookdetails[0]){
            res.render("rating_details", { book: bookdetails[0] })
          } else {
            res.redirect('/add-rating?error='+"invalid_isbn");
          }
        })
        .catch((err)=>{
         
          res.redirect('/add-rating?error='+"invalid_isbn");
        });
      }
  })
  .catch(err =>{
        res.redirect('/add-rating?error='+"invalid_isbn");
      
  }); 
}
};

exports.addrating = (req, res) => {
  //validate req
  if (!req.query) {
    res.status(400).send({ message: "Content can't be empty." });
    return;
  }


  //new user
  const rating = new bookdb({
    ISBN: req.query.ISBN,
    Book_Title: req.query.Book_Title,
    Book_Author: req.query.Book_Author,
    Year_of_Publication: req.query.Year_of_Publication,
    Publisher: req.query.Publisher,
    User_ID: req.query.User_ID,
    Book_Rating: req.query.Book_Rating,
  });


  //saving user in db
  rating
    .save(rating)
    .then((data) => {
      res.redirect('/landing?userid='+rating.User_ID);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "An error occured while creating user",
      });
    });
};


exports.findReview = (req,res) =>{
  if(req.query.id){ //if query parameter exists, return that specific user alone
      const id = req.query.id;
      bookdb.find({ _id: { $eq: id } }).limit(1)
          .then(data =>{
            res.render("update_rating", {book: data[0], userid: req.query.userid})
          })
          .catch(err =>{
              res.status(500).render("404",{ message: "Error retrieving"})
          })  
  } 
}
 


exports.logintry=(req,res)=>{
  const id=req.query.userid;
  userdb
  .find({ User_ID: { $eq: id } })
  .then(data=>{
      if(!data||data.length==0){
        res.redirect('/?error=' + encodeURIComponent('usernotfound'));
          
      }else{
        
        res.redirect('/landing?userid='+id);
      }
  })
  .catch(err =>{
      res.status(500).send({ 
          message:"Could not perform find"
      });
  });
};
