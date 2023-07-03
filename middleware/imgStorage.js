const multer = require('multer')
const path = require('path')

const imageConfig = multer.diskStorage({
    destination : (req, files, callback )=>{
        callback(null,path.join(__dirname, "..","/uploads"));
    },
    filename : (req, files, callback)=>{
        callback(null, `image_${Date.now()}.${files.originalname}`);
    }
})
const isImage = (req, files , callback)=>{
    if(files.mimetype.startsWith("image")){
        callback(null, true)
    }else{
        callback(new Error('only image is allowed'));
    }
}
const uploads = multer({
    storage: imageConfig,
    fileFilter: isImage,
}).array('userProfile',3)
module.exports={
    uploads 
}