import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../config/firebaseConfig';
import Instance from '../config/axiosCustomize';

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const [downloadURL, setDownloadURL] = useState('');

    const handleFileChange = (event) => {
        console.log("File selected:", event.target.files[0]);
        setFile(event.target.files[0]);
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        console.log("Upload button clicked");
        if (file) {
            console.log("Uploading file:", file.name);
            const fileRef = ref(storage, `songs/${file.name}`);
            const metadata = {
                contentType: 'audio/mpeg'
            };
            try {
                await uploadBytes(fileRef, file, metadata);
                const url = await getDownloadURL(fileRef);

                // Send URL to backend using Axios
                await Instance.post('/upload', { url });

                console.log("URL sent to backend");
                setDownloadURL(url); // Update state with the download URL
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        } else {
            console.error("No file selected");
        }
    };

    return (
        <div style={{ backgroundColor: 'white' }}>
            <form onSubmit={handleUpload}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
            {downloadURL && (
                <div>
                    <p>File uploaded successfully. Access it <a href={downloadURL}>here</a></p>
                    <audio controls>
                        <source src={downloadURL} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )}
        </div>
    );
};

export default UploadFile;