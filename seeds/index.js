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
        description: '  Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora itaque nobis accusamus minus omnis asperiores totam quasi fuga maxime facilis aliquid non velit, alias fugiat quaerat laborum odit enim explicabo.',
        price,
        geometry:{
          type:"Point",
          coordinates:[28.6139, 77.2090]
        },
        images:[
          {
            url: 'https://res.cloudinary.com/dlwicchqr/image/upload/v1743088972/CampSters/ruk3iduqx4umphxynb19.webp',
            filename: 'CampSters/ruk3iduqx4umphxynb19',
            
          },
          {
            url: 'https://res.cloudinary.com/dlwicchqr/image/upload/v1743088972/CampSters/devklxyxxwv0lvu4kjgm.webp',
            filename: 'CampSters/devklxyxxwv0lvu4kjgm',
          },
          {
            url: 'https://res.cloudinary.com/dlwicchqr/image/upload/v1743088971/CampSters/sm3qflmtns0camfvfdlz.webp',
            filename: 'CampSters/sm3qflmtns0camfvfdlz',
          },
          {
            url: 'https://res.cloudinary.com/dlwicchqr/image/upload/v1743088971/CampSters/cvplzte4nsvol1n1dl3r.webp',
            url: 'https://res.cloudinary.com/dlwicchqr/image/upload/v1743088972/CampSters/bsjlexaz5nyvtcvogvdb.webp',
            filename: 'CampSters/bsjlexaz5nyvtcvogvdb',
            
          }
        ],

      })
      await camp.save();
  }
  
}

seedDB().then(()=>{
  mongoose.connection.close();
})