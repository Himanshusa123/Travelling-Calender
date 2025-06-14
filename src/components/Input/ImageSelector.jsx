import React, { useEffect, useRef, useState } from "react";
import { FaRegFileImage } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const ImageSelector = ({ image,  setImage,handleDeleteImg }) => {
  const inputref = useRef(null);
  const [previewurl, setpreviewurl] = useState(null);

  const handleimagechange = (event) => {
    const file=event.target.files[0];
    if (file) {
        setImage(file)
    }
  };
  const onChoosefile = () => {
    inputref.current.click();
  };
  const handleremoveimage=()=>{
    setImage(null);
    handleDeleteImg()
  }
  useEffect(()=>{
    // if the image prop is a string (URL),set it as the preview url
    if (typeof image==='string') {
        setpreviewurl(image);
    }else if (image) {
        // if the image prop is a file object create a preview url
        setpreviewurl(URL.createObjectURL(image))
    }else{
        // if there is no image clear the preview url
        setpreviewurl(null);
    }
    return()=>{
if (previewurl && typeof previewurl==='string' && !image) {
    URL.revokeObjectURL(previewurl)
}
    }
  },[image])
  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={inputref}
        onChange={handleimagechange}
        className="hidden"
      />
      {!image ? ( <button
        className="w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border border-slate-200/50"
        onClick={()=> onChoosefile()}
      >
        <div className="w-14 h-14 flex items-center justify-center bg-cyan-50 rounded-full border border-cyan-100 ">
          <FaRegFileImage className="text-xl text-cyan-500" />
        </div>
        <p className="text-sm text-slate-500">Browse image files to upload</p>
      </button>):(
      <div className="w-full relative">
        <img src={previewurl} alt="Selected" className="w-full h-[300px] object-cover rounded-lg" />
        <button className="btn-small btn-delete absolute top-2 right-2" onClick={handleremoveimage}>
            <MdDeleteOutline className="text-lg"/>
        </button>
      </div>
      )}
    </div>
  );
};

export default ImageSelector;
