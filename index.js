const express = require('express')
require('dotenv').config({ path: './config/.env' })
const passport = require('passport')
const cors = require('cors')

var expressFile = require('express-fileupload');
//initializing the port
const PORT = process.env.PORT || 3000


//importing the routes
// const userRouter = require('./app/routes/user.route')
const adminRouter = require('./app/routes/admin.route')

//creating the server
const app = express()
app.use(cors())
app.use(expressFile());

// Database connection
require('./config/mongodb')


//passport config
app.use(passport.initialize())
require('./config/passport')


// app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//accessing the routes
// app.use(userRouter);
app.use(adminRouter);

//default route
app.all('*', (req, res) => {
    return res.status(200).send("URL not found")
})


//listening the server
app.listen(PORT, () => {
    console.log('server is running on port ' + PORT)
})