import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Pages/Login";
import Register from "./components/Pages/Register";
import Welcome from './components/Pages/Welcome';
import Profile from './components/Pages/Profile';
import CanvasLoader from './components/Pages/CanvasLoader';

function App() {
  return (
    
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/canvas/:uuid" element={<CanvasLoader />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>

  );
}

export default App;