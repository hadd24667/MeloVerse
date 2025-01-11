import axios from 'axios';

const Instance = axios.create({
    // Configuration
    baseURL: 'http://localhost:8080/api/',
    timeout: 8000,
    headers: {
        'Content-Type': 'application/json'
    },
});
export default Instance;