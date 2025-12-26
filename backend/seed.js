require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected for seeding"))
  .catch(err => console.error(err));

    const products = [
  {
    name: "Black Shoes",
    description: "Formal black shoes",
    tags: ["shoes", "black", "formal", "footwear", "sportswear"],
    image: "https://m.media-amazon.com/images/I/71f3BmjCwtL.jpg"

  },
  {
    name: "Blue Denim Jacket",
    description: "Casual denim jacket",
    tags: ["jacket", "denim", "blue", "casual"],
    image: "https://m.media-amazon.com/images/I/51g+JumJl9L.jpg"
  }
];


Product.insertMany(products)
  .then(() => {
    console.log("Products added successfully");
    process.exit();
  })
  .catch(err => console.error(err));
