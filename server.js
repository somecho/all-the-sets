var express = require('express')
var app = express()
var fs = require('fs')

var pcData = JSON.parse(fs.readFileSync("data.json"))
let PORT = process.env.PORT || 8081

//////////////////////////////
// FUNCTIONS
//////////////////////////////
function pcWithSize(size){
  let asArray = Object.entries(pcData)
  let filtered = asArray.filter(([key, value])=> value.length == size)
  return Object.fromEntries(filtered);
}

//////////////////////////////
// ROUTES
//////////////////////////////
app.get('/', (req,res)=>{
  res.end(JSON.stringify(pcData))
})

app.get('/set/:name', (req,res)=>{
  let name = pcData[req.params.name] ? req.params.name : "does not exist"
  let response = {
    name,
    pcs: pcData[req.params.name] || []
  }
  res.end(JSON.stringify(response))
})

app.get('/size/:size', (req,res)=>{
  let response = pcWithSize(req.params.size)
  res.end(JSON.stringify(response))
})

//////////////////////////////
// START SERVER
//////////////////////////////
var server = app.listen(PORT, ()=>{
  console.log(`All The Sets listening at port ${PORT}`)
})
