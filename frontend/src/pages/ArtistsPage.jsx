import React from "react";
import { Link, Outlet } from "react-router-dom";
import "../styles/ArtistsPage.css";
import logo from "../../public/assets/logo.png";
import { useUser } from "../contexts/UserContext";

const ArtistsPage = () => {

  const {user} = useUser();

  return (
    <div className="artists-page">
      <video className="background-video" autoPlay muted loop playsInline>
        <source
          src="../../public/assets/artistsBackGround.mp4"
          type="video/mp4"
        />
      </video>
      <header className="header">
        <div className="logo">
          <a href="/home">
            <img className="logo-img" src={logo} alt="logo" />
          </a>
          <div className="logo-text">
            <h3>MeloVerse</h3>
            <h5>For Artists</h5>
          </div>
        </div>
        <nav className="navbar">
          <ul>
            <li>
              <Link to="upload-tracks">Upload Tracks</Link>
            </li>
            <li>
              <Link to="upload-lyrics">Upload Lyrics</Link>
            </li>
            <li>
              <Link to="upload-albums">Upload Albums</Link>
            </li>
            <li>
              <Link to="manage-songs-albums">Manage Songs&Albums</Link>
            </li>
          </ul>
        </nav>

        <div className="profile" >
          {/*<i className="bx bxs-bell"></i>*/}
          <label className=" text-white font-bold" >{user?.userName}</label>
          <a href="/artists">
            <div className="user">
              <div className="left">
                <img src={user?.imagePath||'../../public/assets/avatar.jpg'} alt="UserAdmin profile" />
              </div>
            </div>
          </a>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};

export default ArtistsPage;
