import React from "react";
import PropTypes from "prop-types";

const TrackItem = ({ track, index, handleEditTrack, handleDeleteTrack }) => {
    return (
        <div>
            <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                    <img
                        src={track.image ? URL.createObjectURL(track.image) : ""}
                        alt="Track"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h4 className="text-xl font-bold mb-1">{track.title}</h4>
                    <p className="text-gray-400 text-sm font-medium mt-1">You,{track.artists.map(artist => artist.userName).join(", ")}</p> {/* Thêm lớp mt-1 để giảm khoảng cách */}
                </div>
            </div>

            <div>
                <label className="block text-gray-400 text-sm font-medium mb-1" htmlFor="position">
                    Position
                </label>
                <input
                    type="number"
                    placeholder="Position"
                    readOnly={true}
                    value={track.position}
                    className="w-20 mb-2 py-2 px-1 bg-gray-700 text-white rounded-lg"
                />
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => handleEditTrack(index)}
                    className="w-full py-3 mb-2 bg-pink-200 text-black font-semibold rounded-lg hover:bg-pink-50 transition"
                >
                    Edit
                </button>
                <button
                    onClick={() => handleDeleteTrack(index)}
                    className="w-full py-3 mb-2 bg-white text-black font-semibold rounded-lg hover:bg-white transition"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

TrackItem.propTypes = {
    track: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    handleEditTrack: PropTypes.func.isRequired,
    handleDeleteTrack: PropTypes.func.isRequired,
}

export default TrackItem;