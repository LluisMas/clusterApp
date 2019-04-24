const mongoose = require('mongoose');
const { Schema } = mongoose;

const SubjectSchema = new Schema({
  name:      { type: String, required: true  },
  year:      { type: Number, required: true  },
  professor: { type: Schema.Types.ObjectId, required: false, ref: 'User'  },
  students:  { type: Array, default: [], required: false }
});

SubjectSchema.parse = function() {
  return {
    _id: this._id,
    name: this.name,
    year: this.year,
    professor: this.professor,
    students: this.students
  }
};

module.exports = mongoose.model('Subject', SubjectSchema);
