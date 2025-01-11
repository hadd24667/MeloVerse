import { useCallback, useEffect, useMemo, useContext } from "react";
import { useSearch } from "../contexts/SearchContext";
import { SongContext } from "../contexts/SongContext";
import "../styles/SearchResult.css";
import { QueueContext } from "../contexts/QueueContext";

const SearchResult = () => {
  const {
    searchTerm,
    activeTab,
    setActiveTab,
    data,
    startSearch,
  } = useSearch();

  const { fetchSong } = useContext(SongContext);
  const { handleSongClick } = useContext(QueueContext);

  const handleTabChange = useCallback((tab) => {
    if (tab === activeTab) return; 
    setActiveTab(tab); 
  }, [activeTab, setActiveTab]);

  useEffect(() => {
    if (!searchTerm.trim()) return;
    startSearch(searchTerm, activeTab);
  }, [activeTab, searchTerm, startSearch]);
  

  // Lọc dữ liệu theo tab hiện tại
  const filteredData = useMemo(() => {
    return activeTab === "songs"
      ? data.songs || []
      : activeTab === "artists"
      ? data.artists || []
      : data.albums || [];
  }, [data, activeTab]);

  // const handleItemClick = (item) => {
  //   if (activeTab === "songs") {
  //     handleSongClick(item.id, fetchSong);
  //   } else if (activeTab === "artists") {
  //     console.log("Artist clicked:", item.userName);
  //     // Thêm logic cho nghệ sĩ ở đây
  //   } else if (activeTab === "albums") {
  //     console.log("Album clicked:", item.title);
  //     // Thêm logic cho album ở đây
  //   }
  // };
  
  
  return (
    <div className="search-content">
      <div className="tabs">
        <button
          className={activeTab === "songs" ? "active" : ""}
          onClick={() => handleTabChange("songs")}
        >
          Songs
        </button>
        <button
          className={activeTab === "artists" ? "active" : ""}
          onClick={() => handleTabChange("artists")}
        >
          Artists
        </button>
        <button
          className={activeTab === "albums" ? "active" : ""}
          onClick={() => handleTabChange("albums")}
        >
          Albums
        </button>
      </div>

      <div className="results-list">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div key={item.id} className="result-item" onClick={() => activeTab === "songs" && handleSongClick(item.id, fetchSong)}>
              {/* Hiển thị ảnh nếu có */}
              <img
                src={item.imagePath || "../../public/assets/logo.png"}
                alt={item.trackTitle || item.userName || item.title || "Item"}
                className="result-image"
              />
              <div className="result-details">
                {/* Hiển thị nội dung theo tab */}
                {activeTab === "songs" && (
                  <>
                    <h4>{item.trackTitle}</h4>
                    <p>{item.Artist.userName}</p>
                  </>
                )}
                {activeTab === "artists" && (
                  <>
                    <h4>{item.userName}</h4>
                  </>
                )}
                {activeTab === "albums" && (
                  <>
                    <h4>{item.title}</h4>
                    <p>{item.Artist.userName}</p>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResult;
