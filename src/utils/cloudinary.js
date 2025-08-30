import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"

const cloudinaryUpload = async (file) => {
    try {
        if (!file) return null

        const uploaded = await cloudinary.uploader.upload(file,{
            resource_type: "auto"
        })

        console.log("File is Uploaded on Cloudinary !", uploaded.url);

        return uploaded;
        
    } catch (error) {
        fs.utimesSync(file)

        return null;
    }
}

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key : process.env.CLOUDINARY_KEY,
    api_secret : process.env.CLOUDINARY_SECRET
})

export default cloudinaryUpload;