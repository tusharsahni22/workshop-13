const express=require("express");
const jwt=require("jsonwebtoken");
const fs = require('fs');
const app=express();
let cron=require("node-cron");


function runCron() {

    cron.schedule("* * * * * * ",()=>{
  
      fs.appendFile('cronOutput.txt', "\n", function (err) {
        if (err) throw err;  
      });
      
      var time=new Date().toLocaleTimeString();
      
      fs.appendFile('cronOutput.txt', "Current time "+time, function (err) {
        if (err) throw err;
        console.log('Entry uodated');
      });
    
    });
  }
    

app.post('/api/token',(req,res)=>{
const user=req.body;
jwt.sign({user},"secreatkey",(err,token)=>{
  res.json({token});
});

});

app.post("/api/verify",verifytoken,(req,res)=>{
    console.log("token : ",req.token)
  jwt.verify(req.token,"secreatkey",(err,userData)=>{
    if(err){
      res.status(403).json({message:"Unauthorised"});
    }
    else{
      res.json({
        message:"Successful"
      })
    }
  })
})


app.post("/api/runcron",(req,res)=>{
  console.log("cron running")

  runCron();
  res.json({message:"cron updating file...."});
  
})




function verifytoken (req,res,next) {
  const bearerHeader=req.headers['authorization'];
  if(typeof bearerHeader!=="undefined"){
    const bearer = bearerHeader.split(" ");
    const bearertoken=bearer[1];
    req.token=bearertoken;
    next();
  }
  else{
    res.sendStatus(403);
  }
}

app.listen(3000,()=>{console.log("Server running on Port 3000")})