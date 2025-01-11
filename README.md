**MeloVerse**

MeloVerse is a music streaming platform designed to provide an immersive listening experience. It features real-time synchronized lyrics, user roles (Listener, Artist, Admin), and personalized music recommendations powered by machine learning.

Features

Music Streaming: High-quality audio streaming with seamless playback.

Synchronized Lyrics: Real-time lyrics synchronization with songs.

User Roles:

Listeners: Stream music, create playlists, and follow artists.

Artists: Upload and manage tracks, albums, and interact with listeners.

Admins: Manage users, content, and platform settings.

Music Recommendations: Personalized suggestions using collaborative filtering and user listening habits.

Secure and Scalable: Firebase for storage, Node.js backend, and MySQL database for efficient management.

Tech Stack

Frontend

Framework: React

Styling: CSS, Styled Components, Tailwind (for Artist and Admin).

Backend

Server: Node.js with Express

Database: MySQL

Storage: Firebase (for audio and image files)

Machine Learning

Recommendation System: Collaborative Filtering

Installation

Prerequisites

Node.js installed on your machine.

MySQL database set up and running.

Firebase account and project configured.

Steps

Clone the repository:

git clone https://github.com/hadd24667/MeloVerse.git

Navigate to the project directory:

cd MeloVerse

Install dependencies:

npm install

Set up environment variables:
Create a .env file in the root directory and add the following:

PORT=5000
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

Start the development server:

npm start

Usage

Listeners: Create an account, browse music, and build custom playlists.

Artists: Upload tracks, manage albums, and engage with fans.

Admins: Oversee platform operations and manage content.

Roadmap



Contributing

Contributions are welcome! Please follow these steps:

Fork the repository.

Create a new branch for your feature/bugfix.

Commit your changes and push the branch.

Submit a pull request.

License

This project is licensed under the MIT License.

Contact

Author: hadd24667, hieuVKU

GitHub: MeloVerse Repository(https://github.com/hadd24667/MeloVerse)

Email: hahnj24667@gmail.com
