import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from '../App';
import BookDetails from './BookDetails';

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/book/:id" element={<BookDetails />} />
    </Routes>
  </Router>
);

export default AppRouter;
