const mongoose = require('mongoose');
const { Schema } = mongoose;
const Status = require('./SubmissionStatus');

const SubmissionSchema = new Schema({
  name:       { type: String },
  submitted:  { type: Date, default: Date.now(),required: true  },
  status:     { type: Status, required: true, default: Status.NotStarted },
  author:     { type: Schema.Types.ObjectId, required: false, ref: 'User' },
  assignment: { type: Schema.Types.ObjectId, required: false, ref: 'Assignment' },
  file: Buffer, contentType: String,
  jobId:      { type: Number, default: -1}
});

SubmissionSchema.parse = function() {
  return {
    _id: this._id,
    name: this.name,
    submitted: this.submitted,
    status: this.status,
    assignment: this.assignment,
    author: this.author,
    file: this.file,
    jobId: this.jobId
  }
};

module.exports = mongoose.model('Submission', SubmissionSchema);
