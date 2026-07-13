import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styles from './App.module.css';
import { Header } from './components/layout/Header';
import { NavTabs } from './components/layout/NavTabs';
import { AdsPage } from './pages/AdsPage';
import { IdeasPage } from './pages/IdeasPage';

export function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Header />
        <NavTabs />
        <Routes>
          <Route path="/" element={<IdeasPage />} />
          <Route path="/publicidade" element={<AdsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
