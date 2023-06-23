const express =  require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const port = 3000;

const Company = require('./models/company');
const Car = require('./models/car');
const AppError = require('./utils/AppError');
const handleAsync = require('./utils/handleAsync');

const main = async () => {
    try{
      await mongoose.connect('mongodb://127.0.0.1:27017/MottoCompanyManufacture');
      console.log("MONGOOSE CONNECTION ESTABLISHED");

 }
 catch(err){
   console.log("MONGOOSE CONNECTION FAILED", err);

 }
}

main();

app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);


// Company Route
app.get('/home', (req, res) => {
    res.render('company/home');
});

app.get('/companies', handleAsync(async(req, res) => {
    const companies = await Company.find({})
    res.render('company/companies', {companies})
    
}));

app.get('/companies/new', handleAsync(async(req, res) => {
    const car = await Car.find({});
    res.render('company/new', {car});
}));


app.post('/companies', handleAsync(async (req, res) => {
    const company = new Company(req.body);
    await company.save()
    res.redirect('/companies');
}));


app.get('/companies/:id', async(req, res, next) => {
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

app.get('/companies/:id/edit', handleAsync(async(req, res, next) => {
    const {id} = req.params;
    const company = await Company.findById(id);
     if(!company){
        next( new AppError('Can not Edit this Company!', 404));
    }
    res.render('company/edit', {company});
}));


app.patch('/companies/:id', handleAsync(async(req, res, next) => {
    const {id} = req.params;
    const company = await Company.findByIdAndUpdate(id, req.body, {runValidators: true});
     if(!company){
        return next( new AppError('Error In Updating Company!', 404));
    }
    res.redirect(`/companies/${company._id}`);
}));

app.get('/companies/:id/cars/new', handleAsync(async(req, res, next) => {
    const {id} = req.params;
    const company = await Company.findById(id);
     if(!company){
        return next( new AppError('Can not Find Company!', 404));
    }
    res.render('car/new', {company});
}));

app.post('/companies/:id/cars', handleAsync(async(req, res) => {
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


app.delete('/companies/:id', handleAsync(async(req, res) => {
    const {id} = req.params;
    await Company.findByIdAndDelete(id);
    res.redirect('/companies');
}));




















// Car Route


app.get('/cars', handleAsync(async(req, res) => {
    const cars = await Car.find({});
    res.render('car/home', {cars});
}));

app.get('/cars/new', handleAsync(async(req, res) => {
    const company = await Company.find({});
    res.render('car/new', {company});
}));


app.get('/cars/:id', handleAsync(async(req, res) => {
    const {id} = req.params;
    const car = await Car.findById(id);
    res.render('car/show', {car});
}));

app.post('/cars', handleAsync(async(req, res) => {
    const car = new Car(req.body);
    await car.save()
    res.redirect('/cars');
}))


app.delete('/cars/:id', handleAsync(async(req, res) => {
    const {id} = req.params;
    await Car.findByIdAndDelete(id);
    res.redirect('/cars');
}));


app.use((err, req, res, next) => {
    const {message = 'ERROR!...Nothing found', status = 500, stack} = err;
    res.status(status).render('error', {message, status, stack});
})

app.listen(`${port}`,() => {
    console.log(`Listening on port ${port}`);
});