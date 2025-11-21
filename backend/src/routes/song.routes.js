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
    const mood = req.query.mood?.toLowerCase();
    
    if (!mood) {
      return res.status(400).json({ message: "Mood is required", songs: [] });
    }

    const songs = await songModel.find({ mood });

    console.log("DB Query Mood:", mood);
    console.log("Songs Returned:", songs);

    res.status(200).json({
      message: "songs fetched success",
      songs
    });

  } catch (error) {
    console.error("Error fetching songs:", error);
    res.status(500).json({ message: "Something went wrong", songs: [] });
  }
});

  
module.exports = router;
// //ABHI ISS FILE MAI API TOH BANA DIYA BUT EXPRESS KO TOH YE SMJ
// //HI NAI AATA KI KOI AISI API BANI HAI JISKE LIYE HUM USE KRTE HAI 
// // MIDDLEWARE
// //np

