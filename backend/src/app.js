const express=require('express')
const userRoutes=require('./routes/userRoutes/user.routes')
const propertyRoutes=require('./routes/propertyRoutes/property.route')
const bookingRoutes=require('./routes/bookingRoutes/booking.route')
const paymentRoutes=require('./routes/paymentRoutes/payment.route')
const adminRoutes=require('./routes/adminRoutes/admin.route')
const reviewRoutes=require('./routes/reviewRoutes/review.route')
const cors=require('cors');



const cookieParser=require('cookie-parser')
const app = express()
//npm i morgan
const morgan=require('morgan')              //---> it is a middleware
const errorHandler=require('./middlewares/errorHandler')

app.use(cors({
    credentials:true,
    origin:" http://localhost:5173",
}));

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(morgan("tiny"));




app.get('/',(req,res)=>{
    res.send('Hello World')
});

app.use('/api/auth',userRoutes);
app.use("/api/property", propertyRoutes);
app.use('/api/booking',bookingRoutes);
app.use('/api/payment',paymentRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/review',reviewRoutes)

app.use(errorHandler);



module.exports=app;