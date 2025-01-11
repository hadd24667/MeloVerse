import { useState, useEffect } from "react";
import Instance from "../../config/axiosCustomize.js";
import {useUser} from "../../contexts/UserContext.jsx";

const useFetchAllArtistAlbums = () => {
    const [allArtistAlbums, setArtistAlbums] = useState([]);
    const {user} = useUser();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllArtistAlbums = async () => {
            try {
                const response = await Instance.post('/get-all-artist-albums',{
                    artistID: user.id,
                });
                setArtistAlbums(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllArtistAlbums();
    }, []);

    return { allArtistAlbums, loading, error };
}

export default useFetchAllArtistAlbums;