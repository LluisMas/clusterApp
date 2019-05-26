const mongoose = require('mongoose');
const { Schema } = mongoose;
const Status = require('./SubmissionStatus');

const SubmissionSchema = new Schema({
  name:           { type: String },
  submitted:      { type: Date, default: Date.now(),required: true  },
  status:         { type: Status, required: true, default: Status.NotStarted },
  author:         { type: Schema.Types.ObjectId, required: false, ref: 'User' },
  assignment:     { type: Schema.Types.ObjectId, required: false, ref: 'Assignment' },
  file:             Buffer, contentType: String,
  jobId:          { type: Number, default: -1 },
  originalName:   { type: String, default: '' },
  executionTime:  { type: [Number], default: -1 },
  outputs:        { type: [String] },
  results:        { type: [Boolean] }
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
    jobId: this.jobId,
    origin: this.originalName,
    executionTime: this.executionTime,
    outputs: this.outputs,
    results: this.results
  }
};

SubmissionSchema.pre('remove', function (next) {
  console.log('[Submission] removing: ' + this._id);
  next();
});

module.exports = mongoose.model('Submission', SubmissionSchema);
