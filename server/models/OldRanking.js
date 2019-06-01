const mongoose = require('mongoose');
const { Schema } = mongoose;

const oldrankingSchema = new Schema({
  user:         { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  assignment:   { type: Schema.Types.ObjectId, required: true, ref: 'Assignment' },
  ranking:      { type: Object}
});

oldrankingSchema.parse = function() {
  return {
    _id: this._id,
    user: this.user,
    assignment: this.assignment,
    ranking: this.ranking
  }
};

module.exports = mongoose.model('oldranking', oldrankingSchema);
