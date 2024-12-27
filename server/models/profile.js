const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  gender: {
    type: String,
    enum: ["Male", "Female", "Other","Non-Binary", "Prefer not to say",],
    default: "Add Gender",  // Default value if gender is not provided
    required:false
  },
  dob: {
    type: Date,
    required: false,  // Optional field
  },
  about: {
    type: String,
    required: false,  // Optional field
  },
  contact: {
    type: Number,
    trim: true,
    required: false,  // Optional field, you can change this to `true` if you need it required
  },
});

module.exports = mongoose.model("Profile", profileSchema);
