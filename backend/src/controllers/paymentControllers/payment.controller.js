const Booking = require("../../models/bookingModels/booking.model.js");
const paymentInstance = require("../../services/payment.services.js");
const CustomError = require('../../utils/customError.js')
const crypto = require("crypto");
const { paymentConfirmationTemplate } = require("../../utils/emailTemplate.js");
const { sendMail } = require("../../utils/email.js");

 
const  processPaymentController=async(req,res,next)=>{

    try{

        const {amount,currency}=req.body;

        if(!amount||!currency) 
            return next(new CustomError("All feilds are required in proccesspaymentcontroller",400));

        const options={
            amount:amount*100,
            currency:currency||"INR",
            receipt:`receipt ${Date.now()}`,
            payment_capture:1

        }
        const razorpayOrder=await paymentInstance.orders.create(options);

        if (!razorpayOrder) return next(new CustomError("Error in payment", 400));

        res.status(200).json({
            messsage :"Paymen proccessed successfully ",
            success:true,
            data:razorpayOrder
        })


    }
    catch(error){
        next(new CustomError(error.message,500));
    }
}

const verifyPaymentController=async(req,res,next)=>{

    try{
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

      if(!razorpay_order_id||!razorpay_payment_id||!razorpay_signature)
        return next(new CustomError("All feilds are required in verifying payment",400));
      const booking=await Booking.findOne({
        razorpayOrderId:razorpay_order_id,
      })
      .populate("user_id","userName email")
      .populate("property","location");


    if (!booking) return next(new CustomError("Booking not found", 404));

    const generatedSignature=crypto
    .createHmac("sha256",process.env.RAZORPAT_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

    if(generatedSignature!==razorpay_signature)
        return next(new CustomError("Verification failed, Payment declined", 400));
    booking.status="Completed";
    booking.paymentDetails={
        payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      signature: razorpay_signature,
    }

    await booking.save();

    const emailTemplate= paymentConfirmationTemplate(
        req.user.userName,
        booking.property.location,
        booking.status,
        booking.totalPrice
    )

  await sentMail
    res.status(
        process.env.EMAIL_USER,
        "Booking and Payment Completed",
        emailTemplate
    );


    res.status(200).json({
        success: true,
        message: "Booking and payment completed",
        data: booking,
      });

    }
    catch(error){
        next(new CustomError(error.message,500))
    }
};







module.exports={
    processPaymentController,
    verifyPaymentController
}