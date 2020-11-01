//jshint esversion:6
//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");

const app = express();


app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/whiteDB", {useNewUrlParser: true,useUnifiedTopology: true})

const whiteSchema = {
  email: String,
  password: String,
  balance:Number
};


const User = new mongoose.model("User", whiteSchema);

var oldbalance=400000;
var newbalance=oldbalance;

const lucas = new User({
  email:"1@h.com",
  password:"123",
  balance:newbalance
});
lucas.save(function(err){
  if(err) {

    console.log("your account is temporarily suspended contact admin");
  } else {
    console.log(lucas.balance)
  }
});



app.post("/login", function(req, res){
const username = req.body.username;
 const password = req.body.password;
 console.log(password, username)
 User.findOne({email: username}, function(
  err,foundUser){
    if(err){
      console.log(err);
    } else {
      if (foundUser){
        if(foundUser.password===password){
          res.sendFile(__dirname +"/dashboard.html")
        } else{
          res.sendFile(__dirname +"/demo.html")
          console.log("password in correct")
        }
      } else {
        res.sendFile(__dirname +"/demo.html")
        console.log("user not found")
      }
    }
  })
});

app.post("/transfer", function(req,res){
  const transferAmount=req.body.amount;
  console.log(transferAmount);
  
  newbalance=newbalance-transferAmount;
  if(newbalance<=390000){
    res.redirect("/failure")
  } else{
    console.log(newbalance);
    User.updateOne({_id:"5f9ecd77a34d921278cdcba3"}, {balance:newbalance},function(err){
      if(err){
        console.log(err)
      } else{
        res.redirect("/success")
        console.log("successfully updated")
      }
    })
  }

});
app.get("/", function(req, res){
    res.sendFile(__dirname + "/demo.html")
    console.log("home")
});

app.get("/account", function(req,res){
  res.sendFile(__dirname + "/dashboard.html")
  var para= document.createElement("h2");
  var node= document.createTextNode(balance);
  para.appendChild(node);
  var current=document.getElementById("balance");
  current.appendChild(para);
})
app.get("/bills", function(req,res){
  res.sendFile(__dirname +"/bills.html")
})
app.get("/transfer", function(req,res){
  res.sendFile(__dirname + "/transfer.html")
})
app.listen(process.env.PORT || 3000, function() {
    console.log("You Sabi guy")
  
  });