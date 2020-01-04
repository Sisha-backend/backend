const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');


var connection = mongoose.createConnection("mongodb://localhost/local");
autoIncrement.initialize(connection);

const AnswerSchema = new Schema({
    Text: { type: String, required: true },
    IsRight: { type: Boolean, required: true },
});

const questionSchema = new Schema({
    questionId: { type: Number, required: true },
    text: { type: String, required: true },
    answers: { type: [AnswerSchema], required: true },
});

//const Question = mongoose.model('Question', questionSchema);
questionSchema.plugin(autoIncrement.plugin, {
    model: 'Question',
    field: 'questionId',
    startAt: 1
});
const Question = connection.model('Question', questionSchema);

module.exports = Question;