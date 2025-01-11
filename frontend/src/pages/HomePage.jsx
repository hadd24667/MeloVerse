import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import PlayerAction from '../components/PlayerAction.jsx';
import PlayerControl from '../components/PlayerControl.jsx';
import Queue from '../components/Queue.jsx';
import { QueueContext } from "../contexts/QueueContext.jsx";
import { useSearch } from "../contexts/SearchContext";
import SearchResult from '../components/SearchResult.jsx';
export function HomePage() {

   const { activeComponent } = useContext(QueueContext);
   const { isSearching } = useSearch();

  return(
   <div className="app-layout">
      <header className="header">
         <Header />
      </header>
      <aside className="app-sidebar">
         <Sidebar />
      </aside>
      <main className="main-content">
      {isSearching ? <SearchResult /> : <Outlet />}
      </main>
      <div className="player-action">
         {activeComponent === "PlayerAction" && <PlayerAction />}
         {activeComponent === "Queue" && <Queue />}
      </div>
      <div className='player-control'>
         <PlayerControl />
      </div>
   </div>
  );
}
