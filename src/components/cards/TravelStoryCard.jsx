import React from "react";
import moment from "moment";
import { FaHeart } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";

const TravelStoryCard = ({
  imageUrl,
  title,
  story,
  date,
  Location,
  isFavourite,
  onEdit,
  onClick,
  onfavouriteclick,
}) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-slate-200 transition-all ease-in-out relative cursor-pointer w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-sm mx-auto">
      {/* Image */}
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-40 sm:h-48 md:h-56 lg:h-60 object-cover rounded-t-lg"
        onClick={onClick}
      />

      {/* Favourite Button */}
      <button
        className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/40 rounded-lg border border-white/30 absolute top-3 right-3 sm:top-4 sm:right-4"
        onClick={onfavouriteclick}
      >
        <FaHeart
          className={`icon-btn ${
            isFavourite ? "text-red-500" : "text-white"
          }`}
        />
      </button>

      {/* Content */}
      <div className="p-3 sm:p-4" onClick={onClick}>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <h6 className="text-sm sm:text-base font-medium">{title}</h6>
            <span className="text-xs sm:text-sm text-slate-500">
              {date ? moment(date).format("Do MMM YYYY") : "-"}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          {story?.slice(0, 60)}
        </p>

        <div className="inline-flex items-center gap-2 text-[11px] sm:text-[13px] text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1">
          <GrMapLocation className="text-sm" />
          {Location.map((item, index) =>
            Location.length === index + 1 ? `${item}` : `${item}, `
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelStoryCard;
