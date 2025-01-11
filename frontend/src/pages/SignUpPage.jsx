import { useState } from 'react';
import axiosInstance from '../config/axiosCustomize';
import { useNavigate } from 'react-router-dom';
import '../styles/SignUp.css';
import { useUser } from "../contexts/UserContext.jsx";

export function SignUpPage() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');
    const [profile, setProfile] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const { fetchUserData } = useUser();

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (role === 'artist' && (!profile || !email || !email.includes('@') || !email.includes('.'))) {
            alert("Please fill out the profile and email fields correctly!");
            return;
        }

        try {
            const checkResponse = await axiosInstance.post('/check-username', { userName });
            if (checkResponse.data.exists) {
                alert("UserName already exists!");
                return;
            }

            const checkEmailResponse = await axiosInstance.post('/check-email', { email });
            if (checkEmailResponse.data.exists) {
                alert("Email already exists!");
                return;
            }

            const payload = { userName, password, role, profile, email };
            console.log('Sending Payload:', payload);
            const response = await axiosInstance.post('/signup', payload);
            console.log(response.data);
            if(role === 'artist'){
                alert("Your registration is pending approval!");
            }else {
                alert("Listener created successfully!");
            }
            navigate('/login');
        } catch (error) {
            console.error("Error:", error.response ? error.response.data : error.message);
            alert(error.response && error.response.data && error.response.data.error
                ? error.response.data.error
                : 'Sign up not successful!');
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

    return (
        <div className="SignUp">
            <div className="form-container1">
                <h2>Sign Up</h2>
                <div className="button-container1">
                    <button className="button1" onClick={handleGoogleLogin}>
                        <img src="https://img.icons8.com/ios-glyphs/30/FFFFFF/google-logo.png" alt="Google logo" />
                        Continue with Google
                    </button>
                    <button className="button1">
                        <img src="https://img.icons8.com/ios-glyphs/30/FFFFFF/facebook-new.png" alt="Facebook logo" />
                        Continue with Facebook
                    </button>
                </div>
                <div className="input-container1">
                    <input
                        type="text"
                        placeholder="UserName"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        autoComplete="username"
                    />
                </div>
                <div className="input-container1">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                </div>
                <div className="input-container1">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                </div>
                <div className="input-container1">
                    <p className="text1">You are?</p>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="" disabled>You are?</option>
                        <option value="artist">Artist</option>
                        <option value="listener">Listener</option>
                    </select>
                </div>
                {role === 'artist' && (
                    <>
                        <div className="input-container1">
                            <input
                                placeholder="Describe yourself (max 500 characters)"
                                value={profile}
                                onChange={(e) => setProfile(e.target.value)}
                                maxLength="500"
                            />
                        </div>
                        <div className="input-container1">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </>
                )}
                <button className="submit-button1" onClick={handleSignUp}>Sign Up</button>
                <p className="text1">Already have an account? <a href="/login" className="hypelink1">Login</a></p>
            </div>
        </div>
    );
}

export default SignUpPage;
