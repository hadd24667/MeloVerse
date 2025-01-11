import { createContext, useContext, useState } from "react";
import axiosInstance from "../config/axiosCustomize";
import { useUser } from "./UserContext";

const MadeForContext = createContext();

const MadeForProvider = ({ children }) => {
  const [mixData, setMixData] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const userID = user?.id;

  const fetchMixData = async (mixType, genre = null) => {
    if (!userID) {
      console.error("Cannot fetch mix data: User ID is undefined");
      return;
    }
    try {
      setLoading(true);
      let apiPath;
      if (mixType === "mega-mix") {
        apiPath = `mega-mix/${userID}`;
      } else if (mixType === "global-mix") {
        apiPath = `global-mix/${userID}`;
      } else if (mixType === "genre-mix" && genre) {
        apiPath = `genre-mix/${userID}/${genre}`;
      } else {
        console.error("Invalid mix type or genre");
        console.log("Mix Type:", mixType);
        console.log("Genre:", genre);
        return;
      }
      const response = await axiosInstance.get(`/${apiPath}`);
      setMixData((prevData) => ({
        ...prevData,
        [mixType]: response.data,
      }));
      console.log("Fetched", mixType, "data:", response.data);
    } catch (error) {
      console.error(`Error fetching ${mixType} data`, error);
    } finally {
      setLoading(false);
    }
  };

  const resetMixData = () => {
    setMixData({});
  };

  return (
    <MadeForContext.Provider value={{ mixData, loading, fetchMixData, resetMixData }}>
      {children}
    </MadeForContext.Provider>
  );
};

export { MadeForContext, MadeForProvider };
