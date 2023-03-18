var express = require('express')
var app = express()
var fs = require('fs')
var cors = require('cors')
app.use(cors({
  origin: "*"
}))

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
  let filtered = asArray.filter(([key, value])=> value["pcs"].length == size)
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
  let result = asArray.filter(([key,value])=>arrayEquals(value["pcs"],ints))
  if (result.length == 0) {
    return {"name":"Not a unique prime form, or not in prime form, or does not exist."}
  } else {
    let name = result[0][0]
    let pcs = ints
    let intervalVector = pcData[result[0][0]]["intervalVector"]
    let ivquery = intervalVector.reduce((a,b)=> a+b, "")

    let zrelated = matchIntervalVector(ivquery)
    zrelated.results = zrelated.results.filter(a=>a.name!==name)
    zrelated.numResults = zrelated.results.length

    return {name,pcs,intervalVector,zrelated} //there is only one result from filter
  }
}
function matchIntervalVector(vector){
  let items = vector.split('');
  let ints = items.map(i=>parseInt(i))
  if(ints.length != 6){
    return {"name":"An interval vector must have 6 values"}
  }
  for(let i in ints){
    if(isNaN(ints[i])){
      return {"name":"An interval vector can only contain integers"}
    }
  }
  let asArray = Object.entries(pcData)
  let result = asArray.filter(([key,value])=>arrayEquals(value["intervalVector"],ints))
  let output = {
    "numResults":result.length,
    "results" : result.map(res=>{
      return {
        "name": res[0],
        "pcs" : res[1]["pcs"],
        "intervalVector": res[1]["intervalVector"]
      }
    })
  }
  return output;
}

function calculateIntervalVector(pcs){
  let size = pcs.length
  let LUT = [0,0,1,2,3,4,5,4,3,2,1,0]
  let intervalVector = [0,0,0,0,0,0]
  for(let i = 0; i < size; i++){
    for(let j = i+1; j < size; j ++){
      let diff = Math.abs(pcs[i]-pcs[j]) % 12
      let id = LUT[diff];
      intervalVector[id]++;
    }
  }
  return intervalVector;
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
    pcs: pcData[req.params.name]["pcs"] || [],
    intervalVector: pcData[req.params.name]["intervalVector"] || []
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

app.get('/interval-vector/:vector',(req,res)=>{
  let response = matchIntervalVector(req.params.vector)
  res.end(JSON.stringify(response))
})

//////////////////////////////
// START SERVER
//////////////////////////////
var server = app.listen(PORT, ()=>{
  console.log(`All The Sets listening at port ${PORT}`)
})
