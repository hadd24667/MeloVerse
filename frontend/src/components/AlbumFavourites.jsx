import React, { useEffect } from "react";
import "../styles/AlbumDetail.css";
import { useFavourite } from "../contexts/FavouriteContext";
import { useUser } from "../contexts/UserContext";
import { LazyLoadImage } from "react-lazy-load-image-component";

const AlbumFavourites = () => {
  const { favourites, loading, error, getFavourites } = useFavourite();
  const { user } = useUser();

  useEffect(() => {
    if (user?.id) {
      getFavourites();
    }
  }, [user]);

  const favoriteAlbums = favourites.filter((fav) => fav.albumID && fav.album);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="album-detail album-favourites">
      <div className="album-header">
        <div className="album-infor">
          <h1>Album Favourites</h1>
        </div>
      </div>
      <div className="song-list">
        {favoriteAlbums.map((fav, index) => (
          <div className="song-item" key={fav.albumID}>
            <div className="song-index">{index + 1}</div>
            <LazyLoadImage
              className="song-image"
              src={fav.album.imagePath}
              alt={fav.album.albumTitle}
            />
            <div className="song-info">
              <span className="song-title">{fav.album.title}</span>
              <span className="song-artist">{fav.album.Artist?.userName}</span>
            </div>
          </div>
        ))}
        {favoriteAlbums.length === 0 && <div>No favorite albums yet</div>}
      </div>
    </div>
  );
};

export default AlbumFavourites;
