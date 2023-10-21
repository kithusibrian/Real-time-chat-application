import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoutes from "./Components/PrivateRoutes";
import { AuthProvider } from "./utils/AuthContext";

import Room from "./Pages/Room";
import LoginPage from "./Pages/LoginPage";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<PrivateRoutes />}>
              <Route path="/" element={<Room />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
