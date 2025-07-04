
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/utils/env";
import { ResponseType } from "@/utils/type";
import axios from 'axios';

const CLOUDINARY_CLOUD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const uploadFiletoCloudinary = async (
    file: { uri: string } | string,
    folderName: string
): Promise<ResponseType> => {
    try {
        if(!file){
            return {success:true, data:null}
        }
        if (typeof file === 'string') {
            return { success: true, data: file };
        }
        if (file && file.uri) {
            const formData = new FormData();
            
            const fileName = file.uri.split("/").pop() || "file.jpg";
            
            formData.append('file', {
                uri: file.uri,
                type: "image/jpeg",
                name: fileName
            } as any);
            
            formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            formData.append("folder", folderName);

            const response = await axios.post(CLOUDINARY_CLOUD_URL, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });


            return { success: true, data: response?.data?.secure_url };
        }

        return { success: false, msg: "No valid file provided" };

    } catch (error: any) {
        console.log('Got error uploading file:', error);
        return { 
            success: false, 
            msg: error?.message || "Failed to upload the image" 
        };
    }
};


export const getFilePath = (file: any): string | any => {
    if (file && typeof file === 'string') {
        return file;
    } else if (file && typeof file === 'object' && file.uri) {
        return file.uri;
    }
    return null; 
};
