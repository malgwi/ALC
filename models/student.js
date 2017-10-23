let mongoose = require('mongoose');

// Resource schema
let studentSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  body:{
    type: String,
    required: true
  }
});

let Student = module.exports = mongoose.model('Student', studentSchema);
