const mongoose = require("mongoose");
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
  email:{
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password:{
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters']
  },
});
 
var bookSchema = new mongoose.Schema({
  ISBN: {
    type: Number,
    required: true,
  },
  Book_Title: {
    type: String,
    required: true,
  },
  Book_Author: {
    type: String,
    required: true,
  },
  Year_of_Publication: {
    type: Number,
    required: true,
  },
  Publisher: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  Book_Rating: {
    type: Number,
    required: true,
  },
});

userSchema.pre('save', async function(next){
  const salt = await bcrypt.genSalt();
  console.log(salt);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


userSchema.statics.login = async function(email,password){
  const user = await this.findOne({email:email}); //check if email exists in db

  if(user) {
    const auth = await bcrypt.compare(password, user.password);
    if(auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
}
const userdb = mongoose.model("user1", userSchema);
const bookdb = mongoose.model("books", bookSchema);

module.exports = {
  userdb,
  bookdb,
};
