const mongoose = require('mongoose');

const matchReviewSchema = new mongoose.Schema({
    matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },//who wrote the review
    revieweeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },//who is reviewed
    review: { type: String, required: true,enum: ['bad', 'good', 'excellent'] },
    rating: { type: Number, required: true,enum: [1, 2, 3, 4, 5] },
    comment: { type: String, maxlength: 500, optional: true },
    createdAt: { type: Date, default: Date.now }
});
matchReviewSchema.index({ matchId: 1, reviewerId: 1 }, { unique: true });
module.exports = mongoose.model('MatchReview', matchReviewSchema);