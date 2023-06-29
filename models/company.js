const mongoose = require('mongoose');
const {Schema} = mongoose;
const Car = require('./car');



const CompanySchema = new Schema({
    name:{
        type: String,
        required: [true, 'Car must have a name!']
    },
    email:{
        type: String,
        required: [true, 'Must provide Car Email!']
    },
    location:{
        type: String,
        required: [true, 'Must provide Car Location!']
    },
    price:{
        type: Number,
        required: [true, 'Must provide Car Price']
    },
    image:{
        type: String,
        // required: [true, 'Provide Car Image!']
    },
    info:{
        type: String,
    },
    cars: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Car'
    }
]
})

CompanySchema.post('findOneAndDelete', async function(company){
    if(company.cars.length){
        const res = await Car.deleteMany({_id: {$in: company.cars}});
        console.log(res) 
    }
})


const Company = mongoose.model('Company', CompanySchema);

module.exports = Company;