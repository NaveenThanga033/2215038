import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  shortCode: 
  { type: String,
     required: true },

  timestamp: 
  { type: Date, 
    default: Date.now },
  referrer: 
  { type: String },

  location: 
  { type: String } // Coarse-grained geo-location
});

export default mongoose.model("Click", clickSchema);
