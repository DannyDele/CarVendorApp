const express =  require('express');
const router = express.Router();

const Company = require('../models/company');
const Car = require('../models/car');
const AppError = require('../utils/AppError');
const handleAsync = require('../utils/handleAsync');



router.get('/cars', handleAsync(async(req, res) => {
    const cars = await Car.find({});
    res.render('car/home', {cars});
}));

router.get('/cars/new', handleAsync(async(req, res) => {
    const company = await Company.find({});
    res.render('car/new', {company});
}));


router.get('/cars/:id', handleAsync(async(req, res) => {
    const {id} = req.params;
    const car = await Car.findById(id);
    res.render('car/show', {car});
}));

router.post('/cars', handleAsync(async(req, res) => {
    const car = new Car(req.body);
    await car.save()
    res.redirect('/cars');
}))


router.delete('/cars/:id', handleAsync(async(req, res) => {
    const {id} = req.params;
    await Car.findByIdAndDelete(id);
    res.redirect('/cars');
}));

module.exports = router;