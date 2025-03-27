const mongoose=require('mongoose');
const cities=require('./cities');
const {places,descriptors}=require('./seedHelpers');
const Campground=require('../models/campground');
 
 mongoose.connect('mongodb://127.0.0.1:27017/new-yelp-camp-db',{
   useNewUrlParser:true,
   useUnifiedTopology:true
 })
 
 const db=mongoose.connection;
 db.on("error",console.error.bind(console,"connnection error:"));
 db.once("open",()=>{
   console.log("database connected");
 });

const sample= array => array[Math.floor(Math.random()*array.length)];


const seedDB=async ()=>{
  await Campground.deleteMany({});
  for(let i=0;i<50;i++){
      const random1000=Math.floor(Math.random()*1000);
      const price=Math.floor(Math.random()*100)+10;
      const camp=new Campground({
        author:'67e47c8f7233f679b16ce337',
        location:`${cities[random1000].city},${cities[random1000].state}`,
        title:`${sample(descriptors)} ${sample(places)}`,
        image: `https://picsum.photos/400?random=${Math.random()}`,
        description: '  Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora itaque nobis accusamus minus omnis asperiores totam quasi fuga maxime facilis aliquid non velit, alias fugiat quaerat laborum odit enim explicabo.',
        price

      })
      await camp.save();
  }
  
}

seedDB().then(()=>{
  mongoose.connection.close();
})