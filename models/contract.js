const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContractSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    startDate: Date,
    endDate: Date,
    details: String
});

const Contract = mongoose.model('Contract', ContractSchema);
module.exports = Contract;
