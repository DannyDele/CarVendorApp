const express =  require('express');
const router = express.Router();

const Company = require('../models/company');
const Car = require('../models/car');
const AppError = require('../utils/AppError');
const handleAsync = require('../utils/handleAsync');



router.get('/', handleAsync(async(req, res) => {
    const companies = await Company.find({})
    res.render('company/companies', {companies})
    
}));

router.get('/new', handleAsync(async(req, res) => {
    const car = await Car.find({});
    res.render('company/new', {car});
}));


router.post('/', handleAsync(async (req, res) => {
    const company = new Company(req.body);
    await company.save()
    res.redirect('/companies');
}));


router.get('/:id', async(req, res, next) => {
    try{
    const {id} = req.params;
    const company = await Company.findById(id).populate('cars');
    if(!company){
       throw new AppError('Company Not Found!', 404);
    }
    res.render('company/show', {company});
     }
        catch(err){
            next(err)
        }
});

router.get('/:id/edit', handleAsync(async(req, res, next) => {
    const {id} = req.params;
    const company = await Company.findById(id);
     if(!company){
        next( new AppError('Can not Edit this Company!', 404));
    }
    res.render('company/edit', {company});
}));


router.patch('/:id', handleAsync(async(req, res, next) => {
    const {id} = req.params;
    const company = await Company.findByIdAndUpdate(id, req.body, {runValidators: true});
     if(!company){
        return next( new AppError('Error In Updating Company!', 404));
    }
    res.redirect(`/companies/${company._id}`);
}));

router.get('/:id/cars/new', handleAsync(async(req, res, next) => {
    const {id} = req.params;
    const company = await Company.findById(id);
     if(!company){
        return next( new AppError('Can not Find Company!', 404));
    }
    res.render('car/new', {company});
}));

router.post('/:id/cars', handleAsync(async(req, res) => {
    const {id} = req.params;
    const company = await Company.findById(id);
    const car = new Car(req.body);
    company.cars.push(car);
    car.company = company;
    // res.send(company);
    await car.save();
    await company.save();
    res.redirect(`/companies/${company._id}`);
}));


router.delete('/:id', handleAsync(async(req, res) => {
    const {id} = req.params;
    await Company.findByIdAndDelete(id);
    res.redirect('/companies');
}));


module.exports = router;


