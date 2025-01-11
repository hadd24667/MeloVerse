import { Link, Outlet } from "react-router-dom";
import "../styles/StartPage.css";

const StartPage = () => {
  return (
    <div className="start-page">
      <video className="background-video" autoPlay muted loop playsInline>
        <source
          src="../../public/assets/startBackground.mp4"
          type="video/mp4"
        />
      </video>
      <header className="start-page-header">
        <button className="login-button">
          <Link to="/login">Login</Link>
        </button>
        <button className="singin-button">
          <Link to="/signup">Sign Up</Link>
        </button>
      </header>
      <div className="big-text">
        <h1>MELOVERSE</h1>
        <h3>Your World, Your Music, Your Meloverse</h3>
      </div>
    </div>
  );
};

export default StartPage;
