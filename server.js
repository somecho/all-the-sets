var express = require('express')
var app = express()
var fs = require('fs')

var pcData = JSON.parse(fs.readFileSync("data.json"))
let PORT = process.env.PORT || 8081


app.get('/', (req,res)=>{
  // res.send('Hello World')
  res.end(JSON.stringify(pcData))
})

// app.get('/my-app',function(req,res){
//   res.send('This is my app')
// })

// app.get('/format',function(req,res){
//   var response = {
//     name: "Barbara",
//     age: 33
//   }
//   res.end(JSON.stringify(response))
// })

// app.get('/vars/:name', function(req,res){
//   res.send(req.params.name)
// })

var server = app.listen(PORT, ()=>{
  console.log(`Example app listening at port ${PORT}`)
})
