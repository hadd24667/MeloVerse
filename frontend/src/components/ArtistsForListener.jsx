import React, { useContext } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "../styles/ArtistsForListener.css";
import { Link } from "react-router-dom";
import { ArtistContext } from "../contexts/ArtistContext";

const ArtistsForListener = () => {
  const { artists, loading, error } = useContext(ArtistContext);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="artist-for-listener">
      <div className="artist-title">
        <h1>Popular Artists</h1>
      </div>
      <div className="artist-list">
        {artists.map((artist, index) => (
          <Link
            to={`/home/artists-for-listener/${artist.id}`}
            key={artist.id}
            className="artist-item"
          > 
            <span className="artist-rank">#{index + 1}</span>
            <LazyLoadImage
              src={artist.imagePath || "../../public/assets/defaultArtist.png"}
              alt={artist.userName}
              className="artist-image"
            />
            ;
            <div className="artist-details">
              <span className="artist-name">{artist.userName}</span>
              <span className="artist-followers">
                {artist.followerCount} followers
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ArtistsForListener;
