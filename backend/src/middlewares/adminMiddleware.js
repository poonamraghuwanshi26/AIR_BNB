const cacheClient = require("../services/cache.services");
const CustomError = require("../utils/customError")
const jwt=require('jsonwebtoken');
const User=require('../models/userModels/user.model')

const adminMiddleware= async(req,res,next)=>{
    
    const {token}=req.cookies;

    try{


        if(!token)return next(new CustomError("Tooken Not found in adminmiddleware,Unauthorized user!",404));

        const isBlacklistedToken =await cacheClient.get(token);
        if(isBlacklistedToken )
            return next(new CustomError("Token is blacklisted",400));

        const decode= jwt.verify(token,process.env.JWT_SECRET);
      
        const user=await User.findById(decode.id);
       if(!user)return next(new CustomError("User not found in adminmiddleware",404));
       if (!user.isAdmin) return next(new CustomError("Access Denied from user.isAdmin ", 400));
        // if(req.user.isAdmin!==true)
        //     return next(new CustomError("Access Denied",400));

        req.user=user;
        next();

    }
    catch(error){
        next(new CustomError("error in adminMiddleware",500))
    }
};

module.exports=adminMiddleware;