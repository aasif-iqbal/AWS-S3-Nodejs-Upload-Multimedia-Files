import app from "./app.js";
import dbConnect from "./database/dbConfig.js";

const dbConnection = dbConnect();

const port = process.env.PORT || 3000;

dbConnection
.then(() => console.log("Database connected successfully"))
.then(() => app.listen(port, () => {
    console.log("Server is running on port 3000");
}));
