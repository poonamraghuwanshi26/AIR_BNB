require('dotenv').config();
const app=require('./src/app');
const connectDB=require('./src/config/db/db')




connectDB()

const port=process.env.PORT;
app.listen(port,()=>{
    console.log("server is started on port", port)
})


