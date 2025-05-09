const logger=require('../utils/logger')

const errorHandler=(err,req,res,next)=>{

    logger.error(
        `${err.status||500}-${err.message}-${err.method}-${req.originalUrl}-${req.ip}`

    );

    res.status(err.status||500).json({success:false,message:err.message||"Internal Server Error"});

};


module.exports=errorHandler