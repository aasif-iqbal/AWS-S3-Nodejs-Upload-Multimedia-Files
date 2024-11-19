import express from "express";
import path from "path";
import multer from "multer";
import sharp from "sharp";
import crypto from "crypto";
import dotenv from "dotenv";

import IgPost from "./models/igPost.js";

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

dotenv.config();

const app = express();

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

// Set the view engine to EJS
app.set("view engine", "ejs");

// Set the directory for EJS templates
app.set("views", path.resolve("src/views"));

// Middleware for serving static files
app.use(express.static(path.resolve("src/public")));

// Middleware for parsing form data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const randomImageName = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

app.post("/posts", upload.single("image"), async (req, res) => {
  try {
    // Modify image with sharp - resize it to iphone portrait size
    const buffer = await sharp(req.file.buffer)
      .resize({ height: 1080, width: 1920, fit: "contain" })
      .toBuffer();
    const imageName = randomImageName();
    // Upload the file to S3
    const params = {
      Bucket: bucketName,
      Key: imageName,
      Body: buffer,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);
    // Send the command to S3
    const response = await s3.send(command);

    //save it to database
    await IgPost.create({
      image: imageName,
      caption: req.body.caption,
    });

    res.redirect("/");
    // console.log("File uploaded successfully:", response);
    // res.status(200).send({ message: "File uploaded successfully", response });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send({ message: "Error uploading file", error });
  }
});

app.get("/", async (req, res) => {
  try {
    const posts = await IgPost.find();

    for (const post of posts) {
      const getObjectParams = {
        Bucket: bucketName,
        Key: post.image,
      };

      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      post.imageUrl = url;
    }
    res.render('index', {posts});
    // res.status(200).send({ message: "Posts fetched successfully", posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send({ message: "Error fetching posts", error });
  }
});

app.get('/newPost', (req, res) => {   
  res.render('newPost');
});

app.post("/deletePost/:id", async (req, res) => {
  try {    
    const postId = req.params.id;
    console.log(postId);
    const post = await IgPost.findById(postId);
    
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }    

    // Delete the file from S3    
    const deleteParams = {
      Bucket: bucketName,
      Key: post.image,
    };    
    
    const deleteCommand = new DeleteObjectCommand(deleteParams);    
    const deleteResponse = await s3.send(deleteCommand);
    
    if (!deleteResponse) {
      return res.status(500).send({ message: "Error deleting file" });  
    }
    
    // Delete the post from the database
    await IgPost.deleteOne({ _id: postId });

    res.redirect("/");
    // res.status(200).send({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send({ message: "Error deleting post", error });
  }
}); 

export default app;
