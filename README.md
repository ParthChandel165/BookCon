<div align="center" style="background-color: white;">
    <img width="226" alt="BookCon Logo" src="https://www.buffalolib.org/sites/default/files/users/cenblog/bookcon.png">


## 🌟BookCon🌟

BookCon is a multi-vendor platform designed for book enthusiasts, where users can buy and sell books. The application allows users to register as sellers, enabling them to create and manage their shops and list books for sale. Administrators oversee the platform, ensuring smooth seller activities and maintaining overall functionality.

Buyers can easily browse or search for books, add them to their shopping carts, and place orders using one of three available payment methods. BookCon fosters a seamless and engaging experience, connecting readers, sellers, and administrators in a vibrant book marketplace.
</div>

##  Tech Stack
**Frontend:**

![reactjs](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)&nbsp;
![react-router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)&nbsp;
![redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)&nbsp;
![tailwindcss](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)&nbsp;
![mui](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)&nbsp;

**Backend:**

![nodejs](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)&nbsp;
![expressjs](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)&nbsp;
![mongodb](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)&nbsp;

**Realtime Communication:**

![socketio](https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white)

**package manager**

![Yarn](https://img.shields.io/badge/Yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white)

##  Features

- User Authentication Pages 
  - User Signup 
    - Email verification
    - Upload a Profile image 
  - User Login 
- Home Page 
  - View all product uploads by seller 
  - Filter with the category 
  - Best-selling product (Sort by Sold_out data) 
  - All Product 
  - All Event's 
  - FAQ 
- Filters for Sorting Posts 
  - Sort posts by categories of books
- User Search Bar 
  - Search for product 
  - Click on a user to go to the Product details page 
- Wish list 
  - Store in cart 
- Add to cart 
  - Check out for payment 
    - we have 2 payment systems,**Card**,**Cash of Delivery (COD)**
- Apply Coupon Code for Discount 
- Product Explore Page 
  - View Product from another seller 
  - View reviews from other users 
  - The eye button shows Product Details 
  - Original Price and discount price 
  - How Many people bought this product  
  - Inc and Dec product   
  - Show Description of product 
  - View Seller Profile 
  - Chating with Seller 
  - Show Seller Information 
  - Show Related Products 
  - Add to Wishlist 
  - Add to Cart  
- User Profile Page 
  - Edit your profile details - profile photo, name, email, phone number 
  - Change Password 
  - View All Orders
  - After Delivery of the product user can Refund the product. 
  - User inbox Chat with the seller. 
  - Use can Track Orders.
  - **Only Admin show Admin Dashboard** 
  - Logout 
  - Create a Review After Delivery Product

- Message 
  - Send Message 
  - Show active or not 
  - Time of Message that is sent. 
- Popular Events 
  - Show Recent Events
- Seller Authentication Pages 
  - Seller Signup 
    - shop name, Phone Number, Email address, Address, Zip Code, Password 
    - upload a Profile image 
    - email verification 
  -  Seller Login 
- Seller Dashboard 
  - Overview of a Product and Latest Orders 
  - Account Balance (with 10% service charge) 
- All Orders 
   - Seller Update Product Delivery status 
  - Create Products  
     - name*
     - Description *
     - Category * 
  - All product 
     - Seller can delete Products 
    - View all Products 
 - Create an Event  
    - name* 
   - Description *
   - Category *  
   - Tags
   - Original Price
   - Price (With Discount) *
   - Product Stock *
   - Event Start Date * 
   - Event End Date * (Default 3 days)
- All Event 
  - Show Event 
  - Delete Event  
- Withdraw Money 
  - Add Bank Details 
  - Not withdraw the highest amount of Balance 
  - Send mail to sell with amount 
  - Delete Bank Details 
- Shop Inbox 
    - All Messages 
    - Sand Image to user 
    - Show Active function 
- Discount Codes 
  - Create coupon code 
  - Delete coupon code 
  - Apply all Products of the shop  
  - Can apply the specific product 
- Refunds 
  - Seller can update the Status of the Product 
- Settings 
  - update Images, Shop Address, Shop Phone Number, Shop Zip Code 
  - Add Shop description 
- Shop Dashboard 
   - Shop Products 
   - Running Events 
   - Shop Reviews 
   - Log out  
- Admin Authentication Pages (normal user in DB roll in Admin) 
   - Admin Signup 
   - Admin Login 
  - Overview 
        - Total Earning 
        - All Sellers 
        - All Orders 
        - Latest Orders 
  - Show All Orders of Seller
  - Show All sellers and Delete 
  - Show All users and Delete 
  - All Products in DB. 
  - All Events of Seller 
  - Verify  Seller Withdraw request and Send mail to update's 
  - If Delete images it also deletes from the local device.

## File structure
#### `frontend` - Holds the client application
- #### `public` - This holds all of our static files
- #### `src`
    - #### `assets` - This folder holds assets such as images, docs, and fonts
    - #### `components` - This folder holds all of the different components that will make up our views
      - Admin
      - cart
      - Checkout
      - Events
      - Layout
      - Logout
      - Payment
      - Products
      - Profile
      - Route
      - Shop
      - Signup
      - Wishlist
     - #### `pages` - This folder holds All pages Admin, shop, user
       - Shop
     - #### `redux` - This folder holds all states of the Web app
       - action
       - reducer
     - #### `static` - This folder holds Static file like logo categorie
    - #### `App.js` - This is what renders all of our browser routes and different views
    - #### `index.js` - This is what renders the react app by rendering App.js, should not change
- #### `package.json` - Defines npm behaviors and packages for the client
#### `backend` - Holds the server application
- #### `config` - This holds our configuration files, like mongoDB uri
- #### `controller` - These hold all of the callback functions that each route will call
- #### `db` - These hold all of Data Base Connection
- #### `middleware` - These hold all error handle
- #### `models` - This holds all of our data models
- #### `uploads` - Store all image in hear
- #### `utils` - This holds all of our HTTP to URL. jwtToken and sand mail, Token gentrare
- #### `mlter.js` - Sand mail login
- #### `server.js` - Defines npm behaviors and packages for the client
- #### `package.json` - Defines npm behaviors like the scripts defined in the next section of the README
#### `socket` - Socket.io is use to chaing feacher
  - .env
  - index.js
  - package.json
#### `.gitignore` - Tells git which files to ignore
#### `README` - This file!

---

How to run the app locally! 

### STEP-1
` cd` into the root of the project 

### STEP-2
- `cd frontend`
- `yarn install`
- `yarn start`

### STEP-3
- `cd backend`
- `yarn install`
- create folder `uploads`
- create `confilg` folder and a `.env` file
- use your Cradincial in.env file

```
PORT = 8000
DB_URL = ""
JWT_SECRET_KEY = ""
JWT_EXPIRES = 7d
ACTIVATION_SECRET = 
SMPT_HOST = 'smtp.gmail.com'
SMPT_PORT = 465
SMPT_PASSWORD = 
SMPT_MAIL =
STRIPE_API_KEY = 
STRIPE_SECRET_KEY = 
```
- `yarn start`

### STEP-4

- `cd socket`
- `yarn install`
- create a `.env` file
```
PORT = 4000
```
- `yarn start`


©2024 BookCon. All rights reserved.