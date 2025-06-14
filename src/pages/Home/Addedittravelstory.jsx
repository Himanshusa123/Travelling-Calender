import React, { useState } from "react";
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from "react-icons/md";
import DateSelector from "../../components/Input/DateSelector";
import ImageSelector from "../../components/Input/ImageSelector";
import TagInput from "../../components/Input/TagInput";
import axiosinstance from "../../utils/axiosinstance";
import moment from "moment";

import { toast } from "react-toastify";
import uploadImage from "../../utils/uploadImage";

const Addedittravelstory = ({ storyInfo, type, onClose, getallstory }) => {
  const [visitedDate, setvisiteddate] = useState(storyInfo?.visitedDate ||null);
  const [title, settitle] = useState( storyInfo?.title || "");
  const [storyimg, setstoryimg] = useState(storyInfo?.imageUrl || null);
  const [story, setstory] = useState(storyInfo?.story || "");
  const [visitedLocation, setvisitedlocation] = useState(storyInfo?.visitedLocation ||[]);
  const [error, seterror] = useState("");

  // add new travel story
  const addNewtravelstory = async () => {
    try {
      var imageUrl = "";
      // upload image if present
      if (storyimg) {
        // get image url
        imageUrl = await uploadImage(storyimg);
   
        
      }
      const response = await axiosinstance.post("/add-travel-story", {
        title,
        story,
        imageUrl :imageUrl, 
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      });
      if (response.data && response.data.story) {
        toast.success("Story Added Successfully");
        // refresh stories
        getallstory();
        // close modal or form
        onClose();
      }
    } catch (error) {
     if (error.response && error.response.data && error.response.data.message) {
      seterror(error.response.data.message)
     }else{
      // handle unexpected errors
      seterror("an unexpected error occured. Please try again")
     }
     
      
    }
  };

  // update travel story
  const updateTravelStory = async () => {

    const storyId=storyInfo._id;
    try {
      let imageUrl = "";
    

      let postdata={
        title,
        story,
        imageUrl :storyInfo.imageUrl || " ",
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      }
if (typeof storyimg === "object") {
  // upload new image
  const imageuploadres=await uploadImage(storyimg);
  imageUrl=imageuploadres || "";
  
  postdata={
    ...postdata,
    imageUrl:imageUrl,
  }
}

      
      const response = await axiosinstance.put("/edit-story/"+storyId,postdata);
      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");
        // refresh stories
        getallstory();
        // close modal or form
        onClose();
      }
    }catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
       seterror(error.response.data.message)
      }else{
       // handle unexpected errors
       seterror("an unexpected error occured. Please try again")
      }
      
       
     }
  };

  const handleaddorupdateclick = () => {
    ( {
      title,
      story,
      storyimg,
      visitedLocation,
      visitedDate,
    })
    if (!title) {
      seterror("Please enter the title");
      return;
    }
    if (!story) {
      seterror("Please enter the story");
      return;
    }
    seterror("");
    if (type === "edit") {
      updateTravelStory();
    } else {
      addNewtravelstory();
    }
  };
  const handleDeleteImg = async () => {
    try {
      // Deleting the image
      const deleteImageResponse = await axiosinstance.delete("/delete-image", {
        params: {
          imageUrl: storyInfo.imageUrl,
        },
      });
  
      // Check if the image was deleted successfully
      if (deleteImageResponse.status === 200) {
        const storyId = storyInfo._id;
        const postData = {
          title,
          story,
          visitedLocation,
          visitedDate: Date.now(), // Using Date.now() for current timestamp
          imageUrl: "", // Clear the image URL
        };
  
        // Updating the story
        const updateResponse = await axiosinstance.put(`/edit-story/${storyId}`, postData);
  
        // Check if the story was updated successfully
        if (updateResponse.status === 200) {
          setstoryimg(null); // Clear the image state
        } else {
          console.error("Failed to update the story:", updateResponse.data);
          // Optionally show an error message to the user
        }
      } else {
        console.error("Failed to delete the image:", deleteImageResponse.data);
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error("Error in handleDeleteImg:", error);
      // Optionally show an error message to the user
    }
  };
  return (
    <div className="relative" >
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>
        <div>
          <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
            {type === "add" ? (
              <button className="btn-small" onClick={addNewtravelstory}>
                <MdAdd className="text-lg" /> ADD STORY
              </button>
            ) : (
              <>
                <button className="btn-small" onClick={handleaddorupdateclick}>
                  <MdUpdate className="text-lg" /> UPDATE STORY
                </button>
              </>
            )}
            <button className="" onClick={onClose}>
              <MdClose className="text-xl text-slate-400" />
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-xs pt-2 text-right">{error}</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex-1 flex flex-col gap-2 pt-4">
          <label className="input-label">TITLE</label>
          <input
            type="text"
            className="text-2xl text-slate-950 outline-none"
            placeholder="A Day at the Great Wall"
            value={title}
            onChange={({ target }) => settitle(target.value)}
          />
          <div my-3>
            <DateSelector date={visitedDate} setDate={setvisiteddate} />
          </div>
          <ImageSelector
            image={storyimg}
            setImage={setstoryimg}
            handleDeleteImg={handleDeleteImg}
          />
          <div className="flex flex-col gap-2 mt-4">
            <label className="input-label">STORY</label>
            <textarea
              type="text"
              className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
              placeholder="Your Story"
              rows={10}
              value={story}
              onChange={({ target }) => setstory(target.value)}
            />
          </div>
          <div className="pt-3">
            <label className="input-label">VISITED LOCATIONS</label>
            <TagInput tags={visitedLocation} setTags={setvisitedlocation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addedittravelstory;

{
  /* <button className="btn-small btn-delete" onClick={onClose}>
                  <MdDeleteOutline className="text-lg" /> DELETE
                </button> */
}
