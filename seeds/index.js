const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seeddescriptor');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/campground', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', () => {
    console.log('Database connected')
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randomIndex = Math.floor(Math.random() * cities.length);
        const randomCity = cities[randomIndex];
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
          //your user id
            author: '65fbdbdab98786c68890f321',
            location: `${randomCity.City}, ${randomCity.State}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            price: price,
            geometry: { type: 'Point', coordinates: [randomCity.Longitude,randomCity.Latitude] },
            images: [{
                    url: 'https://res.cloudinary.com/dq9uryp0w/image/upload/v1711823438/campGround/mkxkl9aiqkftxrhjxgmr.jpg',
                    filename: 'campGround/mkxkl9aiqkftxrhjxgmr.jpg'
                },
                {
                    url: 'https://res.cloudinary.com/dq9uryp0w/image/upload/v1711823437/campGround/eqbajv97cq35bdxrgihe.jpg',
                    filename: 'campGround/eqbajv97cq35bdxrgihe.jpg'
                },
                {
                    url: 'https://res.cloudinary.com/dq9uryp0w/image/upload/v1711823437/campGround/a0kh4bfewy7a9xgznsbj.jpg',
                    filename: 'campGround/a0kh4bfewy7a9xgznsbj.jpg'
                }
            ]
        });
        await camp.save();
    }
    console.log('Database seeded successfully');
}

seedDB().then(() => {
    mongoose.connection.close();
});
