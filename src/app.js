import express from 'express';
import path from 'path';

import multer from 'multer'
import sharp from 'sharp'
import crypto from 'crypto'

const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the directory for EJS templates
app.set('views', path.resolve('src/views')); 

// Middleware for serving static files
app.use(express.static(path.resolve('src/public')));

// Middleware for parsing form data
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.get('/', (req, res) => {
  const data = { title: 'Welcome to My App', message: 'Hello, EJS with ES6!' };
  res.render('index', data);
});


app.post('/posts', upload.single('image'), async (req, res) => {
    const file = req.file;
    console.log(file);
    const filename = `${crypto.createHash('sha256').update(file.originalname).digest('hex')}.jpg`;
    console.log(filename);
    
    const resizedImage = await sharp(file.buffer).resize(400).toBuffer();
    
    await sharp(resizedImage).toFile(`src/public/images/${filename}`);
    
    res.send(`Image uploaded successfully! The resized image is available at /images/${filename}`); 
})
export default app;