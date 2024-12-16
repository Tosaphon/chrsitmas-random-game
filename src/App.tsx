import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NumberInputApp from './NumberInputApp';
import AdminPage from './AdminPage';
import Dashboard from './Dashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NumberInputApp />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
