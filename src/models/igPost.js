import mongoose from "mongoose";

const igPostSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    // imageUrl: {
    //     type: String,
    //     required: true, 
    // },
    caption: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});
    
export default mongoose.model("igPost", igPostSchema);