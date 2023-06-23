const mongoose = require('mongoose');
const {Schema} = mongoose;


const CarSchema = new Schema({
    model:{
        type: String,
        required: [true, 'Company must have a model!']
    },
    year:{
        type: Number,
        required: [true, "Must provide Company's production year!"]
    },
    company:{
        type: Schema.Types.ObjectId,
        ref: 'Company'
    }
})

const Car = mongoose.model('Car', CarSchema);

module.exports = Car;