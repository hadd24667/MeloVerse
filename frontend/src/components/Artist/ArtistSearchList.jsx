import React from "react";
import PropTypes from "prop-types";

const ArtistSearchList = ({ artists, onSelect }) => {
    return (
        <ul className="bg-gray-700 rounded-lg mt-2 max-h-40 overflow-y-auto">
            {artists.map((artist) => (
                <li
                    key={artist.id}
                    onClick={() => onSelect(artist)}
                    className="flex items-center p-2 cursor-pointer hover:bg-gray-600"
                >
                    <img src={artist.imagePath} alt="ArtistAdmin Avatar" className="w-8 h-8 rounded-full mr-2 object-cover" />
                    {artist.userName}
                </li>
            ))}
        </ul>
    );
};

ArtistSearchList.propTypes = {
    artists: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            userName: PropTypes.string.isRequired,
            imagePath: PropTypes.string,
        })
    ).isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default ArtistSearchList;
