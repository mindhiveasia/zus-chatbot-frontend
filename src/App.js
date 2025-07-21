import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatHistoryInterface from './components/ChatHistoryInterface';
import ChatHistoryLookerInterface from './components/ChatHistoryLookerInterface';
import './App.css';

const App = () => (
    <Router>
      <Routes>
        <Route path="/history/:param1" element={<ChatHistoryInterface />} />
        <Route path="/looker/:chat_id" element={<ChatHistoryLookerInterface />} />
      </Routes>
    </Router>
  );

export default App;
