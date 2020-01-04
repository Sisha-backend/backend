const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');


var connection = mongoose.createConnection("mongodb://localhost/local");
autoIncrement.initialize(connection);

const user_statisticSchema = new Schema({
    user_staticId: { type: Number, required: true },
    name: { type: String, required: true },
    group: { type: String, required: true },
    right: { type: Number, required: true },
    wrong: { type: Number, required: true },
    num_r: { type: [Number], required: true },
});

user_statisticSchema.plugin(autoIncrement.plugin, {
    model: 'User_statistic',
    field: 'user_staticId',
    startAt: 1
});

const User_statistic = mongoose.model('User_statistic', user_statisticSchema);

module.exports = User_statistic;