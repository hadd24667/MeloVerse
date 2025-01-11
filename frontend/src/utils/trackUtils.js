export const handleChange = (e, field, index, tracks, setTracks) => {
    const updatedTracks = [...tracks];
    updatedTracks[index][field] = e.target.value;
    setTracks(updatedTracks);
};

export const handleFileChange = (e, field, index, tracks, setTracks) => {
    const updatedTracks = [...tracks];
    updatedTracks[index][field] = e.target.files[0];
    setTracks(updatedTracks);
};

export const handleSearchChange = (e, setSearchQuery) => {
    setSearchQuery(e.target.value);
};

export const handleArtistSelect = (artist, setSelectedArtists, setSearchQuery) => {
    setSelectedArtists((prev) => [...prev, artist]);
    setSearchQuery("");
};

export const handleRemoveArtist = (artistId, setSelectedArtists) => {
    setSelectedArtists((prev) => prev.filter(artist => artist.id !== artistId));
};