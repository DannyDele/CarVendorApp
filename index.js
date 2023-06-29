const express =  require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const port = 3000;
const Company = require('./models/company');

const companiesRoute = require('./routes/companies');
const carsRoute = require('./routes/cars');

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

app.use('/companies', companiesRoute);
app.use('/', carsRoute);

const rand = Math.floor(Math.random() * (3) + 1);

app.get('/home', async (req, res) => {
    const companies = await Company.find({})
    res.render('company/home', {companies, rand});
});


app.use((err, req, res, next) => {
    const {message = 'ERROR!...Nothing found', status = 500, stack} = err;
    res.status(status).render('error', {message, status, stack});
})

app.listen(`${port}`,() => {
    console.log(`Listening on port ${port}`);
});