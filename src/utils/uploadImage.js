import axiosinstance from "./axiosinstance";


const uploadImage=async (imageFile)=>{
    const formdata=new FormData();

    // append image file to form data
    formdata.append('image',imageFile);
    try {
        const response=await axiosinstance.post('image-upload',formdata,{
            headers:{
                'Content-Type':"multipart/form-data",  // set header for file upload
            }
        })
       
      
        
         return response.data.imageUrl;

    } catch (error) {
        console.error("Error uploading the image : ",error);
        throw error;
        
    }
}

export default uploadImage;