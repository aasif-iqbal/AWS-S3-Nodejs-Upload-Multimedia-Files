import express from 'express';
import path from 'path';
const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the directory for EJS templates
app.set('views', path.resolve('src/views')); 

// Middleware for serving static files
app.use(express.static(path.resolve('src/public')));

app.get('/', (req, res) => {
  const data = { title: 'Welcome to My App', message: 'Hello, EJS with ES6!' };
  res.render('index', data);
});

export default app;