import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  originalUrl: 
  {type: String, 
    required: true },

  shortCode: 
  { type: String,
     unique: true,
      required: true },

  expiryDate: 
  { type: Date, 
    required: true },

  createdAt:
  {type: Date, 
    default: Date.now },

  clickCount:
   { type: Number, 
    default: 0 }
});

export default mongoose.model("Url", urlSchema);
