const express = require('express');
const multer = require('multer');
const songModel= require("../models/song.model")
const uploadFile= require('../service/storage.service')
const router = express.Router();


const upload = multer({storage:multer.memoryStorage()});


router.get("/test", (req, res) => {
    res.send(" Test route working");
  });

router.post('/songs',upload.single("audio"),async(req,res)=>{
//agr single file nai hai tohinstead array likhoge

    console.log(req.body);
    console.log(req.file);
    const fileData = await uploadFile(req.file)


    const song = songModel.create(
        {
            title:req.body.title,
            artist:req.body.artist,
            audio:fileData.url,
            mood:req.body.mood
            
        }
    )
    console.log(fileData);
    res.status(201).json({
        message: 'song created successfully', 
        song: song,fileData
    })
    const { mood } = req.query;

})

router.get('/songs', async (req, res) => {
    try {
      const queryMood = req.query.mood?.toLowerCase().trim();
      console.log("Incoming Mood:", queryMood);
  
      const songs = await songModel.find({
        mood: { $regex: new RegExp(`^${queryMood}$`, "i") }
      });
  
      console.log("DB Songs Found:", songs.length);
  
      res.status(200).json({
        message: "songs fetched success",
        songs
      });
    } catch (err) {
      console.error("Error Fetching Songs:", err);
      res.status(500).json({
        message: "Something went wrong",
        reason: err.message
      });
    }
  });
  
module.exports = router;
// //ABHI ISS FILE MAI API TOH BANA DIYA BUT EXPRESS KO TOH YE SMJ
// //HI NAI AATA KI KOI AISI API BANI HAI JISKE LIYE HUM USE KRTE HAI 
// // MIDDLEWARE
// //np

