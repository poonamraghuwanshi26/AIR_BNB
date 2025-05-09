//npm i nodemailer

const nodemailer=require('nodemailer');

const transporter= nodemailer.createTransport({
    service:"gmail",
    auth:{

        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,      //----> I haven't changed the passkey whie creating paymentControllers

    },

});

exports.sendMail=(to,subject,htmlContent)=>{
    const mailOptions={
        from:process.env.EMAIL_USER,
        to,
        subject,
        html:htmlContent,
    };
    return transporter.sendMail(mailOptions,(err,info)=>{
        if(err)console.log("error in emai -->",err);
        console.log("info from email",info);
    })
};

