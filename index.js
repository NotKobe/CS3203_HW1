const express=require ('express');
const app = express();
app.use(express.json());
var tweet = require('./favs.json'); //loading in rendering and the JSOn file
var http=require('http')
var server = http.createServer(app)
var cors= require('cors')
app.use(cors());

app.get('/', (req,res)=>{ 
    res.send("HOME PAGE");
    });
    
//generic get request that shows the entire JSON file
app.get('/api/tweet', (req,res)=>{ 
res.send(tweet);
//console.log("TEST")
});

//gets all tweets (created_at && text) from JSON file
app.get('/api/tweet/created_at&&text', (req,res)=>{ 
    res.send(tweet.map(obj=>({"created_at": obj.created_at , "Text": obj.text}))) 
    //map each created_at and text fields out from the JSON file
    });

//get all the users' ID    
app.get('/api/tweet/user_IDs', (req,res)=>{ 
        res.send(tweet.map(obj=>({"User ID": obj.user.id})))
    });


//get specific details (text and created time) of tweet given an ID
app.get('/api/tweet/:id', (req,res)=>{ 
    let tweets=tweet.find(obj=>obj.id===parseInt(req.params.id));
    if(!tweets) return res.status(404).send("Twitter ID not found in JSON file >:/"); //error handle
    res.send({"crated at" : tweets.created_at, "text": tweets.text});
});

//POST request, adding tweet to JSON file given ID and text
app.post('/api/tweet',(req,res)=>{

const added_Tweet={ //taking in the parameters of the ID and text
    id: req.body.id,
    text: req.body.text
};
tweet.push(added_Tweet); //push it to the tweets JSON file
res.send(added_Tweet);   //send it to server
});

//how to update screen_name given name and new screen name
app.put('/api/tweet/:screen_name',(req,res)=>{
    const tweets=tweet.find(obj=>obj.user.screen_name===req.params.screen_name); //look for screen_name
    if(!tweet) return res.status(404).send("Twitter ID not found in JSON file >:/"); //error handeling

    tweets.user.screen_name=req.params.screen_name //set the value = to the new value from the parameter
    res.send(tweets.user.screen_name) //send updated version back

});

//deleting from our JSON file
app.delete('/api/tweet/:id',(req,res)=>{

    const tweets=tweet.find(obj=>obj.id===parseInt(req.params.id)); //look for matching id
    if(!tweets) return res.status(404).send("Twitter ID not found in JSON file >:/"); //error handling

    const index =tweet.indexOf(tweets) //find where our id is 
    tweet.splice(index,1) //actual deletion
    res.send(tweets) //send tweets back with the delted vaule

});
app.listen(3000,()=> console.log("HOME PAGE"));