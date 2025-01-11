import React, { useState } from "react";
import "../styles/EditPlaylistModal.css";
import { uploadImage } from "../services/UploadService";
import { usePlaylist } from "../contexts/PlaylistContext";

const EditPlaylistModal = ({ isOpen, onClose, playlist, onSave }) => {
    const [title, setTitle] = useState(playlist?.title || "");
    const [image, setImage] = useState(playlist?.imagePath || "");
    const [loading, setLoading] = useState(false);
    const { updatePlaylist } = usePlaylist();

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            setLoading(true);
            const imageUrl = await uploadImage(file);
            setImage(imageUrl);
          } catch (error) {
            console.error("Failed to upload image:", error);
          } finally {
            setLoading(false);
          }
        }
      };
    
      const handleSave = async () => {
        try {
          setLoading(true);
          await updatePlaylist(playlist.id, {
            title,
            imagePath: image
          });
          onClose();
        } catch (error) {
          console.error("Failed to update playlist:", error);
        } finally {
          setLoading(false);
        }
      };
    
      if (!isOpen) return null;

 
      return (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Playlist</h2>
            <div className="modal-body">
              {loading ? (
                <div className="loading">Uploading...</div>
              ) : (
                <img
                  className="playlist-image"
                  src={image || "../../public/assets/playlist-default.png"}
                  alt="Playlist Cover"
                />
              )}
              <div className="form-group">
                <label>Playlist Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter playlist title"
                />
              </div>
              <div className="form-group">
                <label>Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <div className="modal-actions">
                <button onClick={handleSave} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button onClick={onClose}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      );
    };

export default EditPlaylistModal;
