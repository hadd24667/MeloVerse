import React, { useEffect, useParams } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Album.css';
import { useAlbum } from '../contexts/AlbumContext';

const Albums = () => {
    const navigate = useNavigate();
    const { albums, topAlbum, loading, error } = useAlbum();

    useEffect(() => {
        topAlbum();
    }, []);

    if (loading) return <p>Loading albums...</p>;
    if (error) return <p>{error}</p>;

    const handleAlbumClick = (albumID) => {
        navigate(`/home/albums/${albumID}`);
    };

    return (
        <div className="albums-list">
            <div className="albums-title">
                <h1>Albums</h1>
            </div>
            {albums.map((album) => (
                <div key={album.id} className="album-item" onClick={() => handleAlbumClick(album.id)}>
                    <img src={album.imagePath} alt={album.title} className="album-image" />
                    <div className="album-details">
                        <h3 className="album-title">{album.title}</h3>
                        <p className="album-artist">{album.Artist.userName}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Albums;
