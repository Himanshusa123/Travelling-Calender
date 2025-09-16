require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const config = require("./config.json");
const User = require("./models/User.model");
const TravelStory = require("./models/travelStory.model");
const { authenticatetoken } = require("./utilities");
const upload = require("./multer");
const fs = require("fs");
const path = require("path");
const { start } = require("repl");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

mongoose
  .connect(process.env.MONGO_URL,
    { dbName: "travel" },
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(console.log("connected suucesfully mongodb"));

// Create Account
app.post("/create-account", async (req, res) => {
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required " });
  }

  const isuser = await User.findOne({ email });
  if (isuser) {
    return res
      .status(400)
      .json({ error: true, message: "user already exists" });
  }
  const hashedpassword = await bcrypt.hash(password, 10);

  const user = new User({
    fullname,
    email,
    password: hashedpassword,
  });

  await user.save();

  const accessToken = jsonwebtoken.sign(
    {
      userId: user,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "108h" }
  );

  return res.status(201).json({
    error: false,
    user: { fullname: user.fullname, email: user.email },
    accessToken,
    message: "Registration successfully",
  });
});

//Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const accessToken = jsonwebtoken.sign(
    {
      userId: user._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "107h" }
  );

  return res.json({
    error: false,
    message: "Login Successfully",
    user: {
      fullname: user.fullname,
      email: user.email,
    },
    accessToken,
  });
});

//Get user
app.get("/get-user", authenticatetoken, async (req, res) => {
  const { userId } = req.user;

  const isUser = await User.findOne({ _id: userId });

  if (!isUser) {
    return res.sendStatus(401);
  }

  return res.json({
    user: isUser,
    message: "",
  });
});


// Route to handle image upload

app.post("/image-upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: true, message: "No image upload" });
    }

       // Use your Render backend URL here
    const BACKEND_URL = "https://backend-69d2.onrender.com"; // replace with your actual Render URL
    const imageUrl = `${BACKEND_URL}/uploads/${req.file.filename}`;
    
    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Delete an image from uploads folder
app.delete("/delete-image", async (req, res) => {
  const { imageUrl } = req.query;

  if (!imageUrl) {
    return res
      .status(400)
      .json({ error: true, message: "imageurl parameter is required" });
  }
  try {
    // Extract the filename from the imageurl
    const filename = path.basename(imageUrl);

    // define the file path
    const filepath = path.join(__dirname, "uploads", filename);

    // check if the file exists
    if (fs.existsSync(filepath)) {
      // delete the fileb from the uploads folder
      fs.unlinkSync(filepath);
      res.status(200).json({ message: "image deleted successfully" });
    } else {
      res.status(200).json({ error: true, message: "Image not found" });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Serve static files from the uploads and assets directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

//Add travel Story
app.post("/add-travel-story", authenticatetoken, async (req, res) => {
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;
  
    //validate required fields
    if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
      return res
        .status(400)
        .json({ error: true, message: "All field are required" });
    }
  
    // Convert visitedDate from milliseconds to Date object
    const parsedVisitedDate = new Date(parseInt(visitedDate));
  
    try {
      const travelStory = new TravelStory({
        title,
        story,
        visitedLocation,
        userId,
        imageUrl,
        visitedDate: parsedVisitedDate,
      });
      await travelStory.save();
      res
        .status(201)
        .json({ story: travelStory, message: "Added Successfully " });
    } catch (err) {
      res.status(400).json({ error: true, message: err.message });
    }
  });
  
  // get all travel stories
  app.get("/get-all-travel-story", authenticatetoken, async (req, res) => {
    const { userId } = req.user;
  
    try {
      const travelStories = await TravelStory.find({ userId: userId }).sort({
        isFavourite: -1,
      });
      res.status(200).json({ stories: travelStories });
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
  });

// Edit travel Story
app.put("/edit-story/:id", authenticatetoken, async (req, res) => {
    const {id}=req.params;
    const { title, story, visitedLocation, imageUrl, visitedDate }=req.body;
    const {userId}=req.params;
    //validate required fields
    if (!title || !story || !visitedLocation || !visitedDate) {
      return res
        .status(400)
        .json({ error: true, message: "All field are required" });
    }
  
    // Convert visitedDate from milliseconds to Date object
    const parsedVisitedDate = new Date(parseInt(visitedDate));

  try {
    // find the travel story by id ensure it become to the authenticate user
    const travelStory=await TravelStory.findById({ _id:id,userId:userId});

    if (!travelStory) {
      return res.status(404).json({error:true,message:"Travel story not found"},)
    }
   
    const placeholderimageurl = `${BACKEND_URL}/assets/images/3.jpg`;


    travelStory.title=title;
    travelStory.story=story;
    travelStory.visitedLocation=visitedLocation;
    travelStory.imageUrl=imageUrl || placeholderimageurl ;
    travelStory.visitedDate=parsedVisitedDate;

    await travelStory.save();
    res.status(200).json({story:travelStory,message:"Update successfully"})
  } catch (error) {
    res.status(500).json({error:true,message:error.message})
  }
})

// delete a travel story
app.delete("/delete-story/:id", authenticatetoken, async (req, res) => {
const {id}=req.params;
const {userId}=req.user;
try {
   // find the travel story by id ensure it become to the authenticate user
   const travelStory=await TravelStory.findById({ _id:id,userId:userId});

   if (!travelStory) {
     return res.status(404).json({error:true,message:"Travel story not found"},)
   }

   // delete the travel story from the database
   await travelStory.deleteOne({_id:id,userId:userId})
   // Extract the filename from the imageurl
   const imageUrl=travelStory.imageUrl;
   const filename=path.basename(imageUrl);

   // Define the file path
   const filepath=path.join(__dirname,'uploads',filename);

   // Delete the image file from the uploads folder
   fs.unlink(filepath,(err)=>{
    if (err) {
      console.log("Failed to dekete image file");
      
    }
   }) 
   res.status(200).json({message:"Travel story deleted successfully"})
} catch (error) {
  res.status(500).json({error:true,message:error.message})
}
})

// Isfavourite
app.put('/update-is-favourite/:id',authenticatetoken,async(req,res)=>{
  const {id}=req.params;
  const {isFavourite}=req.body;
  const {userId}=req.user;
  try {
    // find the travel story by id ensure it become to the authenticate user
   const travelStory=await TravelStory.findById({ _id:id,userId:userId});

   if (!travelStory) {
     return res.status(404).json({error:true,message:"Travel story not found"},)
   }
   travelStory.isFavourite=isFavourite;
   await travelStory.save();
   res.status(200).json({story:travelStory,message:"Update successfully"})
  } catch (error) {
    res.status(500).json({error:true,message:error.message})
  }
})

// search travel stories
app.get('/search',authenticatetoken,async(req,res)=>{
  const {query}=req.query;
  const {userId}=req.user;
  if (!query) {
    return res.status(404).json({error:true,message:"query is required"})
  }
  try {
    const searchResult=await TravelStory.find({userId:userId,
      $or:[
        {title:{$regex: query , $options:"i"}},
        {story:{$regex: query , $options:"i"}},
        {visitedLocation:{$regex: query, $options:"i"}},
      ],
    }).sort({isFavourite:-1});
    res.status(200).json({stories:searchResult})
  } catch (error) {
    res.status(500).json({error:true,message:error.message})
  }
})

// filter travel stories by date range
app.get('/travel-stories/filter',authenticatetoken,async(req,res)=>{
  const {startDate,endDate}=req.query;
  const {userId}=req.user;

  try {
    // convert startdate and  enddate from millisecond to date objects
    const start=new Date(parseInt(startDate));
    const end=new Date(parseInt(endDate));

    // find travel stories that belong to the authenticated user and fall within the date range

    const filerstories=await TravelStory.find({
      userId:userId,
      visitedDate:{$gte:start,$lte:end},
    }).sort({isFavourite:-1});
    res.status(200).json({stories:filerstories})
  } catch (error) {
    res.status(500).json({error:true,message:error.message})
  }
})


app.listen(7000, () => {
  console.log("server is connect");
});



