import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatHistoryInterface from './components/ChatHistoryInterface';
import './App.css';

const App = () => (
    <Router>
      <Routes>
        <Route path="/history/:param1" element={<ChatHistoryInterface />} />
      </Routes>
    </Router>
  );

export default App;
