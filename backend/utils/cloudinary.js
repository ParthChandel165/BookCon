const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dscrvbhr4",
  api_key: "468149246558174",
  api_secret: "XORaJHBSzG5mxFrr1HSHQdYsPMk",
});

cloudinary.api.ping((error, result) => {
    if (error) {
      console.error("Cloudinary connection failed:", error);
    } else {
      console.log("Cloudinary connected successfully:", result);
    }
  });
module.exports = cloudinary;