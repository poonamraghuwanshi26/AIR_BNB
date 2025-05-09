const jwt=require('jsonwebtoken');
const CustomError = require('../utils/customError');
const cacheClient = require('../services/cache.services');
const User=require('../models/userModels/user.model')

const authMiddleware= async(req,res,next)=>{

    const {token}=req.cookies;

    try{

        if(!token) return next(new CustomError("unauthorised user",401))
           
            const isBlacklistedToken=await cacheClient.get(token);

            if(isBlacklistedToken){
                return res.status(401).json({ message:"token is black listed"})

            }

            const decode=jwt.verify(token,process.env.JWT_SECRET);
            console.log("decode from authmiddlewarer--->",decode)

            const user=await User.findById(decode.id);
            if(!user){
                return next(new CustomError("User not found from authmiddleware",401))

            };

            req.user=user;
            next();


    }
    catch(error){

        next(new CustomError(error.message, 500));

    }
}

module.exports=authMiddleware