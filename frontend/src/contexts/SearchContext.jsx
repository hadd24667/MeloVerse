import { createContext, useState, useContext, useCallback } from "react";
import axiosInstance from "../config/axiosCustomize";

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

// eslint-disable-next-line react/prop-types
export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("songs");
  const [data, setData] = useState({ songs: [], artists: [], albums: [] });

  const resultSearch = async (query, type = null) => {
    const results = await axiosInstance.get(`/search?query=${query}${type ? `&type=${type}` : ''}`);
    console.log(results.data);
    return results.data;
};


const startSearch = useCallback(async (term, type = null) => {
  setSearchTerm(term);

  if (!term.trim()) {
    setData({ songs: [], artists: [], albums: [] });
    setIsSearching(false);
    return;
  }

  try {
    setIsSearching(true);
    const results = await resultSearch(term, type);
    setData(results);
  } catch (error) {
    console.error("Error fetching search results:", error);
  }
}, []);



  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        isSearching,
        setIsSearching,
        activeTab,
        setActiveTab,
        startSearch,
        data,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
