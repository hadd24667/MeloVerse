import '../styles/Header.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../contexts/UserContext.jsx";
import defaultAvt from '../assets/profile.png';
import { useSearch } from "../contexts/SearchContext";
import { useEffect, useState } from "react";


const Header = () => {
    const navigate = useNavigate();
    const { user } = useUser(); 
    const { startSearch, searchTerm } = useSearch();
    const [localSearchTerm, setLocalSearchTerm] = useState("");

    const handleSearchInput = (e) => {
        const term = e.target.value;
        setLocalSearchTerm(term);
    
        // Nếu xóa hết chữ, đặt lại trạng thái
        if (term.trim() === "") {
            startSearch(""); 
        }
    };

    // Debounce để giảm số lần gọi API
    useEffect(() => {
        if (localSearchTerm.trim() === "") {
            return; 
        }
    
        const delayDebounce = setTimeout(() => {
            startSearch(localSearchTerm);
        }, 300);
    
        return () => clearTimeout(delayDebounce); // Xóa timeout nếu người dùng tiếp tục gõ
    }, [localSearchTerm]);
    

    const openArtistPage = () => {
        console.log("header role", user?.role);
        if (user?.role === 'artist') {
            navigate('/artists');
        } else {
            navigate('/not-artist');
        }
    }

    const goToProfile = () => {
        navigate("/profile");
      };

    return (
        <>
            <div className="logo">
                <img className="logo-img" src="../../public/assets/logo.png" alt="logo" />
                <a href="/home">MeloVerse</a>
            </div>
            <div className="nav-links">
            </div>

            <div className="search">
                <i className='bx bx-search'></i>
                <input type="text"
                placeholder="Type here to search"
                value={localSearchTerm}
                onChange={handleSearchInput}
                />
            </div>

            <div className="for-artists">
                <i className='bx bxs-music'></i>
                <a onClick={openArtistPage} target='_blank'>For Artists</a>
            </div>

            <div className="profile">
                <i className='bx bxs-bell'></i>
                <i className='bx bxs-cog'></i>
                <div className="user">
                    <div className="left">
                        <img src={user?.imagePath || defaultAvt} alt="User profile" onClick={goToProfile} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;