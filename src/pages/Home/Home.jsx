import React, { useEffect, useState } from "react";
import Navbar from "../../components/Input/Navbar";
import { useNavigate } from "react-router-dom";
import axiosinstance from "../../utils/axiosinstance";
import TravelStoryCard from "../../components/cards/TravelStoryCard";
import { MdAdd } from "react-icons/md";
import Addedittravelstory from "./Addedittravelstory";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";
import ViewTravelStory from "./ViewTravelStory";
import Emptycard from "../../components/cards/Emptycard";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import FilterInfoTitle from "../../components/cards/FilterInfoTitle";
import { getemptycardmessage, getemptyimg } from "../../utils/helper";

const Home = () => {
  const navigate = useNavigate();
  const [userinfo, setuserinfo] = useState(null);
  const [allstories, setallstories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");

  const [openAddEditModel, setOpenaddeditmodel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [openviewmodel, setviewmodel] = useState({
    isShown: false,
    data: null,
  });
  const [dateRange, setdaterange] = useState({ form: null, to: null });

  // fetch user info
  const getuserinfo = async () => {
    try {
      const response = await axiosinstance.get("/get-user");
      if (response.data && response.data.user) {
        setuserinfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // fetch travel stories
  const getallstory = async () => {
    try {
      const response = await axiosinstance.get("/get-all-travel-story");
      if (response.data && response.data.stories) {
        setallstories(response.data.stories);
      }
    } catch (error) {
      console.log("An unexpected error occurred ,please try again");
    }
  };

  const handleedit = (data) => {
    setOpenaddeditmodel({ isShown: true, type: "edit", data: data });
  };

  const handlevierstory = (data) => {
    setviewmodel({ isShown: true, data });
  };

  const updateisfavourite = async (storyData) => {
    const storyId = storyData._id;
    try {
      const response = await axiosinstance.put(
        "/update-is-favourite/" + storyId,
        {
          isFavourite: !storyData.isFavourite,
        }
      );
      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");
        if (filter === "search" && searchQuery) {
          onSearch(searchQuery);
        } else if (filter === "date") {
          filterstoriebydate(dateRange);
        } else {
          getallstory();
        }
      }
    } catch (error) {
      console.log("An unexpected error occurred ,please try again");
    }
  };

  const deleteTravlstory = async (data) => {
    const storyId = data._id;
    try {
      const response = await axiosinstance.delete("/delete-story/" + storyId);
      if (response.data && !response.data.error) {
        toast.error("Story Deleted Successfully");
        setviewmodel((prevState) => ({ ...prevState, isShown: false }));
        getallstory();
      }
    } catch (error) {
      console.log("An unexpected error");
    }
  };

  const onSearch = async (query) => {
    try {
      const response = await axiosinstance.get("/search", {
        params: { query },
      });
      if (response.data && response.data.stories) {
        setFilter("search");
        setallstories(response.data.stories);
      }
    } catch (error) {
      console.log("An unexpected error");
    }
  };

  const handleclearsearch = async () => {
    setFilter("");
    getallstory();
  };

  const filterstoriebydate = async (day) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null;
      const endDate = day.to ? moment(day.to).valueOf() : null;
      if (startDate && endDate) {
        const response = await axiosinstance.get("/travel-stories/filter", {
          params: { startDate, endDate },
        });
        if (response.data && response.data.stories) {
          setFilter("date");
          setallstories(response.data.stories);
        }
      }
    } catch (error) {
      console.log("error in filter");
    }
  };

  const handleDayclick = (day) => {
    setdaterange(day);
    filterstoriebydate(day);
  };

  const resetfilter = () => {
    setdaterange({ from: null, to: null });
    setFilter("");
    getallstory();
  };

  useEffect(() => {
    getuserinfo();
    getallstory();
  }, []);

  return (
    <>
      <Navbar
        userinfo={userinfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onsearchnote={onSearch}
        handleclearsearch={handleclearsearch}
      />
      <div className="container mx-auto px-4 py-6 md:py-10">
        <FilterInfoTitle
          filter={filter}
          filterDates={dateRange}
          onClear={resetfilter}
        />

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-7">
          {/* Travel stories grid */}
          <div className="flex-1">
            {allstories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {allstories.map((item) => (
                  <TravelStoryCard
                    key={item._id}
                    imageUrl={item.imageUrl}
                    title={item.title}
                    story={item.story}
                    date={item.visitedDate}
                    Location={item.visitedLocation}
                    isFavourite={item.isFavourite}
                    onClick={() => handlevierstory(item)}
                    onfavouriteclick={() => updateisfavourite(item)}
                  />
                ))}
              </div>
            ) : (
              <Emptycard
                imgSrc={getemptyimg(filter)}
                message={getemptycardmessage(filter)}
              />
            )}
          </div>

          {/* Sidebar calendar */}
          <div className="w-full lg:w-[350px]">
            <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
              <div className="p-3">
                <DayPicker
                  captionLayout="dropdown-buttons"
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayclick}
                  pagedNavigation
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit story modal */}
      <Modal
        isOpen={openAddEditModel.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.2)", zIndex: 999 },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <Addedittravelstory
          type={openAddEditModel.type}
          storyInfo={openAddEditModel.data}
          onClose={() => {
            setOpenaddeditmodel({ isShown: false, type: "add", data: null });
          }}
          getallstory={getallstory}
        />
      </Modal>

      {/* View story modal */}
      <Modal
        isOpen={openviewmodel.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.2)", zIndex: 999 },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <ViewTravelStory
          storyInfo={openviewmodel.data || null}
          onClose={() => setviewmodel((prev) => ({ ...prev, isShown: false }))}
          onEditclick={() => {
            setviewmodel((prev) => ({ ...prev, isShown: false }));
            handleedit(openviewmodel.data || null);
          }}
          deleteclick={() => deleteTravlstory(openviewmodel.data || null)}
        />
      </Modal>

      {/* Floating add button */}
      <button
        className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-6 sm:right-10 bottom-6 sm:bottom-10"
        onClick={() =>
          setOpenaddeditmodel({ isShown: true, type: "add", data: null })
        }
      >
        <MdAdd className="text-2xl sm:text-[32px] text-white" />
      </button>

      <ToastContainer />
    </>
  );
};

export default Home;
