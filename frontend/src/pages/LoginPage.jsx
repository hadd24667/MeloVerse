import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axiosCustomize';
import { useUser } from '../contexts/UserContext';
import '../styles/Login.css';

export function LoginPage() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { fetchUserData } = useUser();

    const handleLogin = async () => {
        localStorage.removeItem('token');
        try {
            const response = await axiosInstance.post('/login', { userName, password });
            localStorage.setItem('token', response.data.token);
            await fetchUserData();
            alert('Login successful!');
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/home');
            }
        } catch (error) {
            alert(error.response && error.response.data && error.response.data.error ? error.response.data.error : 'Login not successful!');
        }
    };

    const handleGoogleLogin = () => {
        localStorage.removeItem('token');
        const googleLoginWindow = window.open('http://localhost:8080/api/auth/google', 'googleLogin', 'width=500,height=600');

        window.addEventListener('message', async (event) => {
            if (event.origin === 'http://localhost:8080') {
                const { token } = event.data;
                if (token) {
                    localStorage.setItem('token', token);
                    await fetchUserData();
                    alert('Login successful!');
                    navigate('/home');
                } else {
                    alert('Login not successful! Please try again.');
                }
                googleLoginWindow.close();
            }
        });
    };
    const handleFacebookLogin = () => {
        localStorage.removeItem('token');
        const facebookLoginWindow = window.open('http://localhost:8080/api/auth/facebook', 'googleLogin', 'width=500,height=600');

        window.addEventListener('message', async (event) => {
            if (event.origin === 'http://localhost:8080') {
                const { token } = event.data;
                if (token) {
                    localStorage.setItem('token', token);
                    await fetchUserData();
                    alert('Login successful!');
                    navigate('/home');
                } else {
                    alert('Login not successful! Please try again.');
                }
                facebookLoginWindow.close();
            }
        });
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-form">
                    <h2>Sign in</h2>
                    <div className="input-container">
                        <label>Your user name/Email</label>
                        <input
                            type="text"
                            placeholder="Your email"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div className="input-container">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                        />
                        <span className="forgot-password">Forgot password?</span>
                    </div>
                    <button className="login-btn" onClick={handleLogin}>Sign in</button>

                    <div className="or">
                        <div className="line"></div>
                        <span>or</span>
                        <div className="line"></div>
                    </div>

                    <div className="social-login">
                        <button className="social-btn google-btn" onClick={handleGoogleLogin}>
                            <img src="https://img.icons8.com/ios-glyphs/30/FFFFFF/google-logo.png" alt="Google logo"/>
                            Google
                        </button>
                        <button className="social-btn facebook-btn" onClick={handleFacebookLogin}>
                            <img src="https://img.icons8.com/ios-glyphs/30/FFFFFF/facebook-new.png"
                                 alt="Facebook logo"/>
                            Facebook
                        </button>
                    </div>

                    <p className="signup-text">
                        Don't have an account? <a href="/signup">Sign up</a>
                    </p>
                </div>
                <div className="login-image">
                    <video autoPlay loop muted className="background-video-login">
                        <source src="../../public/assets/cosmos-rock-spin.webm" type="video/webm"/>
                    </video>
                    <p className="logo-text">MELOVERSE</p>
                </div>
            </div>
        </div>
    );
}