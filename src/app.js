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

app.get("/", (req, res) => {
  const data = { title: "Welcome to My App", message: "Hello, EJS with ES6!" };
  res.render("index", data);
});

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

    console.log("File uploaded successfully:", response);
    res.status(200).send({ message: "File uploaded successfully", response });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send({ message: "Error uploading file", error });
  }
});

app.get("/api/posts", async (req, res) => {
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

    res.status(200).send({ message: "Posts fetched successfully", posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send({ message: "Error fetching posts", error });
  }
});
export default app;
