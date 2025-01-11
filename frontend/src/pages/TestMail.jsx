import Instance from "../config/axiosCustomize.js";
import {useState} from "react";

const TestMail = () => {

    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');

    const sendMail = async () => {
        try {
            await Instance.post('/admin/test-mail', {
                email: email,
                message: message
            });
            alert("Send email successfully");
        } catch (error) {
            console.error("Error send email:", error);
            alert("Error Send email");
        }
    }

    return (
        <div className="bg-white">
            <h1>Test Mail</h1>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <textarea placeholder="Message"
            value={message} onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <button onClick={sendMail} >Send</button>
        </div>
    );
};

export default TestMail;