var express = require('express')
var app = express()
var fs = require('fs')

var pcData = JSON.parse(fs.readFileSync("data.json"))
let PORT = process.env.PORT || 8081

//////////////////////////////
// FUNCTIONS
//////////////////////////////
function arrayEquals(a,b){
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val,index)=>val==b[index])
}

function pcWithSize(size){
  let asArray = Object.entries(pcData)
  let filtered = asArray.filter(([key, value])=> value.length == size)
  return Object.fromEntries(filtered);
}

function matchPC(pcs){
  let items = pcs.split(',');
  let ints = items.map(i=>parseInt(i))
  //VALIDATE
  for(let i in ints) {
    if(isNaN(ints[i]) || ints[i] < 0 || ints[i] > 11){
      return {"name":"not a valid PC set"};
    }
  }
  //SORT
  ints.sort((a,b)=>a-b)
  let asArray = Object.entries(pcData)
  let result = asArray.filter(([key,value])=>arrayEquals(value,ints))
  if (result.length == 0) {
    return {"name":"Not a unique prime form, or not in prime form, or does not exist."}
  } else {
    return {"name":result[0][0],
            "pcs":ints} //there is only one result from filter
  }
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

app.get('/pcs/:pcs',(req,res)=>{
  let response = matchPC(req.params.pcs)
  res.end(JSON.stringify(response))
})

//////////////////////////////
// START SERVER
//////////////////////////////
var server = app.listen(PORT, ()=>{
  console.log(`All The Sets listening at port ${PORT}`)
})
