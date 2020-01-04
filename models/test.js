const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');


var connection = mongoose.createConnection("mongodb://localhost/local");
autoIncrement.initialize(connection);

const testSchema = new Schema({
    testId: { type: Number, required: true },
    name: { type: String, required: true },
    questions: { type: [Number], required: true },
    users: { type: [Number], required: true },
});

testSchema.plugin(autoIncrement.plugin, {
    model: 'Test',
    field: 'testId',
    startAt: 1
});

const Test = connection.model('Test', testSchema);

module.exports = Test;