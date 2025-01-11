import "./styles/App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GenreProvider } from "./contexts/GenreContext.jsx"; 
import { LoginPage } from "./pages/LoginPage.jsx";
import { SignUpPage } from "./pages/SignupPage.jsx";
import { UserInfo } from "./pages/UserInfo.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import ArtistsPage from "./pages/ArtistsPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import UploadTracks from "./components/UploadTracks.jsx";
import ArtistsHome from "./components/ArtistsHome.jsx";
import UploadLyrics from "./components/UploadLyrics.jsx";
import UploadAlbums from "./components/UploadAlbums.jsx";
import ManageSongAlbum from "./components/Artist/ManageSongAlbum.jsx";
import StartPage from "./pages/StartPage.jsx";
import Lyrics from "./components/Lyrics.jsx";
import MainContent from "./components/MainContent.jsx";
import Genres from "./components/Genres.jsx";
import Albums from "./components/Albums.jsx";
import AlbumDetail from "./components/AlbumDetails.jsx";
import ArtistsForListener from "./components/ArtistsForListener.jsx";
import ArtistDetail from "./components/ArtistDetails.jsx";
import RecentSongs from "./components/RecentSongs.jsx";
import AlbumFavourites from "./components/AlbumFavourites.jsx";
import ArtistFavourites from "./components/ArtistFavourites.jsx";
import Playlist from "./components/Playlist.jsx";
import PlaylistList from "./components/MyPlaylist.jsx";
import MadeForDetails from "./components/MadeForDetails.jsx";
import FavouriteSongs from "./components/SongFavourites.jsx";

import Layout from "./components/Admin/layouts/Layout.jsx";
import Dashboard from "./components/Admin/contents/Dashboard.jsx";
import ArtistAdmin from "./components/Admin/contents/ArtistAdmin.jsx";
import PendingApproval from "./components/Admin/contents/PendingApproval.jsx";
import UserAdmin from "./components/Admin/contents/UserAdmin.jsx";
import SongAdmin from "./components/Admin/contents/SongAdmin.jsx";
import AlbumAdmin from "./components/Admin/contents/AlbumAdmin.jsx";

import TestMail from "./pages/TestMail.jsx";
import PrivateRoute from "./components/Auth/PrivateRoute.jsx";

import { SongProvider } from "./contexts/SongContext.jsx";
import { QueueProvider } from "./contexts/QueueContext.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";
import { FollowProvider } from "./contexts/FollowContext.jsx";
import { AlbumProvider } from "./contexts/AlbumContext.jsx";
import { ArtistProvider } from "./contexts/ArtistContext.jsx";
import { HistoryProvider } from "./contexts/HistoryContext.jsx";
import { SearchProvider } from "./contexts/SearchContext.jsx";
import { MadeForProvider } from "./contexts/MadeForContext.jsx";
import { PlaylistProvider } from "./contexts/PlaylistContext.jsx";
import { FavouriteProvider } from "./contexts/FavouriteContext.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <StartPage />,
  },
  {
    path: "/home",
    element: (
        <PrivateRoute allowedRoles={['listener', 'artist', 'admin']}>
          <HomePage />
        </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <MainContent />,
      },
      {
        path: "lyrics",
        element: <Lyrics />,
      },
      {
        path: "genres",
        element: <Genres />,
      },
      {
        path: "albums",
        element: <Albums />,
      },
      {
        path: "fav-song",
        element: <FavouriteSongs />,
      },
      {
        path: "albums/:albumID",
        element:  <AlbumDetail />,
      },
      {
        path: "artists-for-listener",
        element: <ArtistsForListener />,
      },
      {
        path: "artists-for-listener/:artistID",
        element: <ArtistDetail />
      },
      {
        path: "recent-songs",
        element: <RecentSongs />,
      },
      {
        path: "album-favourites",
        element: <AlbumFavourites />,
      },
      {
        path: "artist-favourites",
        element: <ArtistFavourites />,
      },
      {
        path: "playlist/:playlistID",
        element: <Playlist />,
      },
      {
        path: "playlist-list",
        element: <PlaylistList />,
      },
      {
        path: "made-for/:mixType",
        element: <MadeForDetails />,
      }
    ],
  },
  {
    path: "/artists",
    element: (
        <PrivateRoute allowedRoles={['artist', 'admin']}>
          <ArtistsPage />
        </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <ArtistsHome />,
      },
      {
        path: "upload-tracks",
        element: <UploadTracks />,
      },
      {
        path: "upload-lyrics",
        element: <UploadLyrics />,
      },
      {
        path: "manage-songs-albums",
        element: <ManageSongAlbum />,
      },
      {
        path: "upload-albums",
        element: <UploadAlbums />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
        <PrivateRoute allowedRoles={['admin']}>
          <Layout />
        </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "pending-approval",
        element: <PendingApproval />,
      },
      {
        path: "songs",
        element: <SongAdmin />,
      },
      {
        path: "album",
        element: <AlbumAdmin />,
      },
      {
        path: "artist",
        element: <ArtistAdmin />,
      },
      {
        path: "user",
        element: <UserAdmin />,
      },
      {
        path: "test-mail",
        element: <TestMail />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/profile",
    element: <UserInfo />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
  const PageRoute = () => {
    return (
        <UserProvider>
          <SongProvider>
            <GenreProvider>
              <HistoryProvider>
                <QueueProvider>
                  <SearchProvider>
                    <FollowProvider>
                      <AlbumProvider>
                        <ArtistProvider>
                          <MadeForProvider>
                            <PlaylistProvider>
                              <FavouriteProvider>
                                <RouterProvider router={router} />
                              </FavouriteProvider>
                            </PlaylistProvider>
                          </MadeForProvider>
                        </ArtistProvider>
                      </AlbumProvider>
                    </FollowProvider>
                  </SearchProvider>
                </QueueProvider>
              </HistoryProvider>
            </GenreProvider>
          </SongProvider>
        </UserProvider>
    );
  };
export default PageRoute;

