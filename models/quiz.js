const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');


var connection = mongoose.createConnection("mongodb://localhost/local");
autoIncrement.initialize(connection);

const quizSchema = new Schema({
    quizId: { type: Number, required: true },
    name: { type: String, required: true },
    questions: { type: [Number], required: true },
});

quizSchema.plugin(autoIncrement.plugin, {
    model: 'Quiz',
    field: 'quizId',
    startAt: 1
});
const Quiz = connection.model('Quiz', quizSchema);

module.exports = Quiz;