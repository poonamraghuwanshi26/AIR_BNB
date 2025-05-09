const Property= require('../../models/propertyModels/property.model');
const CustomError = require('../../utils/customError');

const propertyCreateController= async(req,res,next)=>{

    try{
        const{title,description,price,location,amenties,images}=req.body;
        if(!title&&!description&&!price&&!location&&!amenties&&!images){
            return next(new CustomError("All the feilds are required",400));
        }

        const newProperty=await Property.create({
            title,description,price,location,amenties,images,
            host:req.user._id,
        });

        if(!newProperty){
            return next(new CustomError("Error in creating new property"),400);
        }


    res
    .status(201)
    .json({ message: "Propety created successfully", data: newProperty });


} catch (error) {
    next(new CustomError(error.message, 500));
  }
}

const deletePropertyController= async(req,res,next)=>{
    try{

        const {id}=req.params;
        if(!id)return next(new CustomError("id is required to delete the property",400));

        const deleteProperty=await Property.findByIdAndDelete(id);
        if(!deleteProperty)return next(new CustomError("Error in deleting the property",400))

    res.status(200).json({
        message:"Property deleted Successfully"
    })
    }
    catch(error){
        next(new CustomError(error.message,500));
    }
};

const updatePropertyController= async (req,res,next)=>{
    try{

        const {id}=req.params;
        if(!id)return next(new CustomError("id is required to update the property",400));

        const updatedProperty=await Property.findByIdAndUpdate(id,req.body,{
            new:true,
            runValidators:true,
        });

        if(!updatedProperty)return next(new CustomError("Error in updating the property",400))


    res.status(200).json({
        message:"Property updated Successfully",
        data:updatedProperty
    })
    }
    catch(error){
        next(new CustomError(error.message,500));
    }

};

const viewPropertyController= async(req,res,next)=>{

    try{
        const {id}=req.params;
       if(!id) return next(new CustomError("id is required to veiw property",401))

        const propertyDetails=await Property.findById(id)

    if(!propertyDetails) return next(new CustomError("Error in fetching property details",400))

res.status(200).json({
    message:"Property Details fetched successfully",
    data:propertyDetails,
}) 


    }
    catch(error){
        next(new CustomError(error.message,500));
    }

};

const searchPropertyController=async(req,res,next)=>{

    try{

        const {location,minPrice,maxPrice}=req.body;

        const query={
            ...(location&&{location:{$regex:"location",$options:"i" }}),
            ...(minPrice&&{price:{$gte:minPrice}}),
            ...(maxPrice&&{price:{$lte:maxPrice}})
        }

        const property=await Property.find(query)
        if(!property) return next(new CustomError("Property Not found",400));

        res.status(200).json({
            message:"Property fetched",
            data:property
        });

    }catch(error){
        next(new CustomError(error.message,500))
    }

}


module.exports={
    propertyCreateController,
    deletePropertyController,
    updatePropertyController,
    viewPropertyController,
    searchPropertyController,
};

