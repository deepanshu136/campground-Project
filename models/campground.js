const mongoose = require("mongoose");
const Review=require('./review');
const Schema = mongoose.Schema;

const ImageSchema=new Schema({
  
    url:String,
    filename:String
  
})

ImageSchema.virtual('thumbnail').get(function(){
 return this.url.replace('/upload','/upload/w_200');
})

//const opt={toJSON:{virtuals:true}}

const campgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  price: Number,
  description: String,
  location:String,
  geometry:{
    type:{
      type:String,
      enum:['Point'],
      required:true
    },
    coordinates:{
      type:[Number],
      required:true
    }
  },
  author:{
     type:Schema.Types.ObjectId,
     ref:'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ]
 
});


 
// campgroundSchema.virtual('properties.popUpMarkUp').get(function(){
//   return "Iam PopUp Text !!!";
//  })

campgroundSchema.set('toJSON', { virtuals: true });
 campgroundSchema.virtual('properties').get(function() {
  return {
    popUpMarkUp: `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong><p>${this.description}</p>`
  };
});

campgroundSchema.post("findOneAndDelete", async function (doc) {
    if(doc){
      await Review.deleteMany({
         _id:{
            $in:doc.reviews
         }
      })
    }
});

module.exports = mongoose.model("Campground", campgroundSchema);
