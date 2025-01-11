import { useState, useEffect } from "react";
import Instance from "../../config/axiosCustomize.js";
import {useUser} from "../../contexts/UserContext.jsx";

const useFetchArtistSong = () => {
    const {user} = useUser();

    const [artistSongs, setArtistSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArtistSongs = async () => {
            try {
                const response = await Instance.post('/get-artist-songs', {
                    artistID: user?.id,
                });
                setArtistSongs(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchArtistSongs();
    }, []);

    return { artistSongs, loading, error };
}
export default useFetchArtistSong;