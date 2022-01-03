const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const port = process.env.PORT || 5000;
app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(express.json());
const uri = "mongodb+srv://med:medmed@cluster0.fqe4k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


// async function verifyToken(req, res, next) {
//     if (req.headers?.authorization?.startsWith('Bearer ')) {
//         const token = req.headers.authorization.split(' ')[1];

//         try {
//             const decodedUser = await admin.auth().verifyIdToken(token);
//             req.decodedEmail = decodedUser.email;
//         }
//         catch {

//         }

//     }
//     next();
// }
async function run(){
    try {
        await client.connect();
        const database = client.db('medicare');
        const usersCollection = database.collection('users');
        const doctorsCollection = database.collection('doctor');
        const attendeeCollection = database.collection('attendee');
        const usersinfoCollection = database.collection('usersinfo');

        // user info start


        // user info end

        // image upload
        // app.post('/doctors', async (req, res) => {
        //     const name = req.body.name;
        //     const email = req.body.email;
        //     const pic = req.files.image;
        //     const picData = pic.data;
        //     const encodedPic = picData.toString('base64');
        //     const imageBuffer = Buffer.from(encodedPic, 'base64');
        //     const doctor = {
        //         name,
        //         email,
        //         image: imageBuffer
        //     }
        //     const result = await doctorsCollection.insertOne(doctor);
        //     res.json(result);
        // })
        //  admin
         app.get('/users/:email',async(req,res)=>{
            const email = req.params.email;
            const query = { email: email};
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if(user?.role === 'admin'){
                  isAdmin = true;  
            }
            res.json({admin: isAdmin});
    })
   
         app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });
    
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            console.log(result);
            res.json(result);
        })
        // set admin or admin role set
        app.put('/users/admin',async(req,res)=>{
            const user = req.body;
            console.log('put', user);
            const filter = {email:user.email};
            const updateDoc = {$set:{role: 'admin'}};
            const result = await usersCollection.updateOne(filter,updateDoc);
            res.json(result);
    })

        // end of user part


    // doctor part satrt from here
    //   doctor role
       app.get('/doctors/:email',async(req,res)=>{
        const email = req.params.email;
        const query = { email: email};
        const doctor = await doctorsCollection.findOne(query);
        let isDoctor = false;
        if(doctor?.role === 'doctor'){
              isDoctor = true;  
        }
        res.json({doctor: isDoctor});
})

     app.post('/doctors', async (req, res) => {
        const doctor = req.body;
        const result = await doctorsCollection.insertOne(doctor);
        console.log(result);
        res.json(result);
    });

    app.put('/doctors', async (req, res) => {
        const doctor = req.body;
        const filter = { email: doctor.email };
        const options = { upsert: true };
        const updateDoc = { $set: doctor };
        const result = await doctorsCollection.updateOne(filter, updateDoc, options);
        console.log(result);
        res.json(result);
    })
    // get doctor
    app.get('/doctors',async(req,res)=>{
        const cursor = doctorsCollection.find({});
        const doctor = await cursor.toArray();
        res.send(doctor);
        });

    // set doctor role set
    app.put('/doctors/doctor',async(req,res)=>{
        const doctor = req.body;
        console.log('put', doctor);
        const filter = {email:doctor.email};
        const updateDoc = {$set:{role: 'doctor'}};
        const result = await doctorsCollection.updateOne(filter,updateDoc);
        res.json(result);
})
    // doctor part end

    // attendee part start
    // attendee role
    app.get('/attende/:email',async(req,res)=>{
        const email = req.params.email;
        const query = { email: email};
        const attendee = await attendeeCollection.findOne(query);
        let isAttendee = false;
        if(attendee?.role === 'attendee'){
              isAttendee = true;  
        }
        res.json({attendee: isAttendee});
})

     app.post('/attende', async (req, res) => {
        const attendee = req.body;
        const result = await attendeeCollection.insertOne(attendee);
        console.log(result);
        res.json(result);
    });

    app.put('/attende', async (req, res) => {
        const attendee = req.body;
        const filter = { email: attendee.email };
        const options = { upsert: true };
        const updateDoc = { $set: attendee };
        const result = await attendeeCollection.updateOne(filter, updateDoc, options);
        console.log(result);
        res.json(result);
    })
    // get api for attendee
    app.get('/attende',async(req,res)=>{
        const cursor = attendeeCollection.find({});
        const attendee = await cursor.toArray();
        res.send(attendee);
        });
    // set role set
    app.put('/attende/attendee',async(req,res)=>{
        const attendee = req.body;
        console.log('put', attendee);
        const filter = {email:attendee.email};
        const updateDoc = {$set:{role: 'attendee'}};
        const result = await attendeeCollection.updateOne(filter,updateDoc);
        res.json(result);
})




    // attendee part end

    } 
    finally{
         // await client.close();
    }
}


run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Doctors portal!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})