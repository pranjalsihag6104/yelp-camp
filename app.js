const express=require('express');
const app=express();

app.get('/',(req,res)=>{
  res.send('hello from yelpcamp')
})

app.listen(3000,()=>{
   console.log("serving on port 3000")
})