# MeloVerse

**MeloVerse** is a music streaming platform designed to provide an immersive listening experience. It features real-time synchronized lyrics, user roles (Listener, Artist, Admin), and personalized music recommendations powered by machine learning.

---

## 🚀 Features

- **🎵 Music Streaming**: High-quality audio streaming with seamless playback.  
- **📝 Synchronized Lyrics**: Real-time lyrics synchronization with songs.  
- **👥 User Roles**:  
 ### Listener

- **Search and Listen**: Search for songs, albums, or playlists; stream music in high quality.
- **Create and Manage Playlists**: Create, add, or remove songs from custom playlists.
- **Follow and Like**: Mark songs or albums as favorites and follow artists.
- **User Interface**: Intuitive design with controls for music playback (pause, play, skip).

---

### Artist

- **Upload and Manage Songs**: Upload songs with details, edit or delete tracks.
- **Manage Albums**: Create albums, add songs, and update album info.
- **Track Performance**: View song plays and likes statistics.

---

### Admin

- **Manage Users**: Manage accounts, activate or deactivate users/artists.
- **Statistics and Reporting**: Track user activity, song plays, and campaign performance.

- **🤖 Music Recommendations**: Personalized suggestions using collaborative filtering and user listening habits.  
- **🔒 Secure and Scalable**: Firebase for storage, Node.js backend, and MySQL database for efficient management.

---

## 🛠 Tech Stack

### **Frontend**
- **React.js**: For building dynamic UI components.
- **Tailwind CSS**: Utility-first CSS framework for fast, consistent design.
- **Vite**: Build tool for fast development.
- **Axios**: HTTP requests between frontend and backend.

---

### **Backend**
- **Node.js**: JavaScript runtime for backend logic.
- **Express.js**: Framework for building RESTful APIs.
- **JWT**: Token creation and verification for API security.
- **Passport.js**: User authentication via email/OAuth.

---

### **Database**
- **MySQL**: Relational database for user data, songs, playlists.
- **Sequelize**: ORM for MySQL.

---

### **Authentication and Storage**
- **Firebase**: User authentication and storage for images, audio.


### **Machine Learning**
- **Recommendation System**: Collaborative Filtering  

---

## ⚙️ Installation

### **Prerequisites**
- [Node.js](https://nodejs.org/) installed on your machine.  
- [MySQL](https://www.mysql.com/) database set up and running.  
- [Firebase](https://firebase.google.com/) account and project configured.  

### **Steps**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hadd24667/MeloVerse.git

2. **Navigate to the project directory (open 2 terminals)**:
   ```bash
   cd MeloVerse
   cd frontend
   cd backend
3. **Install dependencies**:
   ```bash
   npm install
4. **Set up environment variables**:
   ```javascript
    PORT=YOUR_PORT
    DB_HOST=your_mysql_host
    DB_USER=your_mysql_user
    DB_PASSWORD=your_mysql_password
    DB_NAME=your_database_name
    FIREBASE_API_KEY=your_firebase_api_key
    FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    FIREBASE_PROJECT_ID=your_firebase_project_id
    FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    FIREBASE_APP_ID=your_firebase_app_id
5. **Start the development server**:
    ```bash
      npm start (backend)
      npm run dev (frontend)
## 📞 Contact
- **Author: hadd24667, hieuVKU**
- **GitHub: MeloVerse Repository**
- **Email: hahnj24667@gmail.com**

## Demo: [video](https://drive.google.com/file/d/1Fa75iZJ8AEbnPCOuUM3Z5Qbu1uUoDscG/view?usp=sharing)




