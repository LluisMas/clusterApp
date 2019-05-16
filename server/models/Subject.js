const mongoose = require('mongoose');
const { Schema } = mongoose;
const scriptsController = require('../controllers/scriptsController');

const SubjectSchema = new Schema({
  name:      { type: String, required: true  },
  year:      { type: Number, required: true  },
  professor: { type: Schema.Types.ObjectId, required: false, ref: 'User'  },
  students:  [{ type: Schema.Types.ObjectId, required: false, ref: 'User' }]
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

SubjectSchema.post('save', function (subject) {
  scriptsController.initSubject(subject._id);
});

module.exports = mongoose.model('Subject', SubjectSchema);
