const Redis=require('ioredis')

const cacheClient=new Redis({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    password:process.env.REDIS_PWD
})

cacheClient.on('connect',()=>{
    console.log("Redis connected")
});
cacheClient.on('error',()=>{
    console.log("errorin connecting the redis")
});



module.exports=cacheClient;