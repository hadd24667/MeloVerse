import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../config/firebaseConfig';

export const uploadMusic = async (file) => {
    const fileRef = ref(storage, `songs/${file.name}`);
    const metadata = {
        contentType: 'audio/mpeg'
    };
    await uploadBytes(fileRef, file, metadata);
    return getDownloadURL(fileRef);
};

export const uploadLyrics = async (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(file);
    });
};

export const uploadImage = async (file) => {
    const fileRef = ref(storage, `images/${file.name}`);
    const metadata = {
        contentType: 'image/*'
    };
    await uploadBytes(fileRef, file, metadata);
    return getDownloadURL(fileRef);
};