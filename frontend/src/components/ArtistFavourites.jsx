import React, { useEffect } from 'react';
import '../styles/ArtistFavourites.css';
import { useFavourite } from '../contexts/FavouriteContext';
import { useUser } from '../contexts/UserContext';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const ArtistFavourites = () => {
    const { favourites, loading, error, getFavourites } = useFavourite();
    const { user } = useUser();

    useEffect(() => {
        if (user?.id) {
            getFavourites();
        }
    }, [user]);

    const favoriteArtists = favourites.filter(fav => fav.artistID && fav.artist);
    console.log('Favorite artists:', favoriteArtists);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="album-detail artist-favourites">
            <div className="album-header artist-header">
                <div className="album-infor artist-infor">
                    <h1>Artist Favourites</h1>
                </div>
            </div>
            <div className="artist-list">
                {favoriteArtists.map((fav) => (
                    <div className="artist-item" key={fav.artistID}>
                        <LazyLoadImage
                            className="artist-image" 
                            src={fav.artist.imagePath}
                            alt={fav.artist.userName}
                        />
                        <div className="artist-info">
                            <span className="artist-name">{fav.artist.userName}</span>
                            <br />
                        </div>
                    </div>
                ))}
                {favoriteArtists.length === 0 && (
                    <div>No favorite artists yet</div>
                )}
            </div>
        </div>
    );
};

export default ArtistFavourites;