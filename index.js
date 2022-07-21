const express = require('express'); 
require('dotenv').config()
const cors = require('cors');  
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { log } = require('console');


const app=express()
const port=process.env.PORT||5000

app.use(cors())
app.use(express.json()) 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1osud.mongodb.net/?retryWrites=true&w=majority`; 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }); 

async function run(){
  try{
     await client.connect() 
     console.log("connected databae ");
     const donorsCollection=client.db('gazipurDb').collection('donor') 
        
    //  product/:id
    app.get('/donors', async(req,res)=>{
        const query={} 
        // console.log(req);
        const cursor=donorsCollection.find(query);
        const donors= await cursor.toArray() 
        res.send(donors)
    })  
    app.get('/donors/:id', async(req,res)=>{
        const id=req.params.id
        // console.log(req);
        const query={_id:ObjectId(id)} 
        const donor= await donorsCollection.findOne(query)
        res.send(donor)
    })  
    app.delete('/donors/:id', async(req,res)=>{
        const id=req.params.id 
        const query={_id:ObjectId(id)}
        const result=await donorsCollection.deleteOne(query)
        res.send(result)
    })   


    // update 

        // update user
        app.put('/donors/:id', async(req, res) =>{
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: updatedUser.name
                    // date: updatedUser.date
                }
            };
            const result = await donorsCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        })
      
    // update
     app.get('/groups/:id',async(req,res)=>{
        const id=req.params.id
         const group= String(id)
         const query={blood:group} 
         const cursor=donorsCollection.find(query)
         const donors=await cursor.toArray()
         res.send(donors)
     }) 

    //  post api 

    app.post('/donors',async(req,res)=>{
        const newDonor=req.body 
        // console.log(newProduct);
        const result=await donorsCollection.insertOne(newDonor) 
        res.send(result) 
        console.log(result); 
        

    }) 
  }finally{

  }
}
app.get('/',(req,res)=>{
    res.send("surver is running on my pc fddfdsfdsfdsfsf")
})
app.listen(port,()=>{
    console.log("app is running on " ,port);
}) 

run().catch(console.dir)