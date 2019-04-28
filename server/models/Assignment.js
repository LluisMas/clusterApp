const mongoose = require('mongoose');
const { Schema } = mongoose;

const AssignmentSchema = new Schema({
  name:      { type: String, required: true  },
  startDate: { type: Date, default: Date.now(),required: true  },
  endDate:   { type: Date, default: Date.now(),required: true  },
  subject:   { type: Schema.Types.ObjectId, required: false, ref: 'Subject' },
});

AssignmentSchema.parse = function() {
  return {
    _id: this._id,
    name: this.name,
    startDate: this.startDate,
    endDate: this.endDate,
    subject: this.subject
  }
};

module.exports = mongoose.model('Assignment', AssignmentSchema);
