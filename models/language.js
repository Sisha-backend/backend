const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const languageSchema = new Schema({
    name: { type: String, required: true },
    questions: { type: [Number], required: true },
});

const Language = connection.model('Language', languageSchema);

module.exports = Language;