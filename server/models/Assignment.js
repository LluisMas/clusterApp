const mongoose = require('mongoose');
const { Schema } = mongoose;

const AssignmentSchema = new Schema({
  name:                 { type: String, required: true  },
  startDate:            { type: Date, default: Date.now(),required: true  },
  endDate:              { type: Date, default: Date.now(),required: true  },
  subject:              { type: Schema.Types.ObjectId, required: false, ref: 'Subject' },
  parallelenvironment:  { type: String, required: false },
  compilecommand:       { type: String, required: false },
  runcommand:           { type: String, required: false },
  cpuamount:            { type: [Number], required: false }
});

AssignmentSchema.parse = function() {
  return {
    _id: this._id,
    name: this.name,
    startDate: this.startDate,
    endDate: this.endDate,
    subject: this.subject,
    parallelenvironment: this.parallelenvironment,
    compilecommand: this.compilecommand,
    runcommand: this.runcommand
  }
};

AssignmentSchema.pre('remove', function (next) {
  console.log('[Assignment] removing: ');
  next();
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
