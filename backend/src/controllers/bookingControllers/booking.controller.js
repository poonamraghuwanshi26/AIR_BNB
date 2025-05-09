
const Booking=require('../../models/bookingModels/booking.model.js');
const Property=require('../../models/propertyModels/property.model.js');     //iska kahi use nhi kiya humne
const { findById } = require('../../models/userModels/user.model.js');
const paymentInstance = require('../../services/payment.services.js');
const CustomError = require('../../utils/customError.js')
const {sendMail}=require('../../utils/email.js');
const { bookingConfirmationTemplate } = require('../../utils/emailTemplate.js');

// yaha per esa kyu ho rha h ki humari property me price kuch or h jo database me store or agara hum yaha kuch or price dete hai to wo koi clash nhi ho rha

const createBookingController=async(req,res,next)=>{

try{
    const { property_id,checkin_date,checkout_date,totalPrice}=req.body;
    if (!property_id && !checkin_date && !checkout_date && !totalPrice)
        return next(new CustomError("All fields are required", 400));

    const property=await Property.findById(property_id);
    if(!property)return next(new CustomError("Property not fount in createbookingcontroller",400));

    const booking=await Booking.create({
        property:property_id,
        user_id:req.user._id,
        checkin_date,
        checkout_date,
        totalPrice,
        status:"Pending"

    })

    const options={
        amount: totalPrice * 100,
        currency: "INR",
        receipt: `receipt ${booking._id}`,
        payment_capture: 1,
    };

    const razorpayOrder=await paymentInstance.orders.create(options);
    booking.razorpayOrderId=razorpayOrder.id;
    await booking.save();
    // email--------

    const bookingTemplate=bookingConfirmationTemplate(
        req.user.userName,
        property.location,
        checkin_date,
        checkout_date,
        razorpayOrder
    );

    await sendMail("pr2862460@gmail.com","Booking Confirmed",bookingTemplate);




    res.status(200).json({
        success: true,
        data: booking,
        amount: totalPrice,
      });

}
catch(error){
    next(new CustomError(error.message,500));
}

}


const viewBookingsController= async(req,res,next)=>{

    const {userId}=req.params;

    try{
        if(!userId) return next(new CustomError("User not found",404));

        const bookings= await Booking.findOne({user_id:userId}).
        populate("user_id",
            "userName email"
        )

        if(!bookings)    return next(new CustomError("Bookings details not found", 404));

        res.status(200).json({
            message:"Booking details",
            data:bookings

        })

    }catch(error){
        next(new CustomError(error.message,500))
    }

}

const cancelBookingController=async(req,rers,next)=>{

    const {id}=req.params;

    try{

        if(!id) return next(new CustomError("cancel booking id not found",404));

      const bookings=await Booking.findById(id);

      if(!bookings)return next(new CustomError("cancel booking not found",404));
      if (bookings.user_id.toString() !== req.user._id.toString())
        return next(new CustomError("Unauthorized user", 401));

      bookings.status="Cancelled";
      await bookings.save();


      res.status(200).json({
        success: true,
        message: "Booking, cancelled",
      });

    }
    catch(error){
        next(new CustomError(error.message,500));
    }
    
}

module.exports={
    createBookingController,
    viewBookingsController,
    cancelBookingController,

}