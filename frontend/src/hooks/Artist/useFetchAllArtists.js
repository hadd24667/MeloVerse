// frontend/src/hooks/useFetchArtists.js
import { useState, useEffect } from "react";
import Instance from "../../config/axiosCustomize.js";
import {useUser} from "../../contexts/UserContext.jsx";

const useFetchAllArtists = () => {
    const [allArtist, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const {user} = useUser();

    useEffect(() => {
        const fetchAllArtists = async () => {
            try {
                const response = await Instance.post('/get-all-artist',{artistID: user.id});
                setArtists(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllArtists();
    }, []);

    return { allArtist, loading, error };
};

export default useFetchAllArtists;