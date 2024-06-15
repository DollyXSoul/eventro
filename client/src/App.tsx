import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/shared/Footer";
import Header from "./components/shared/Header";
import Home from "./components/Home";
import CreateEvent from "./components/CreateEvent";
import EventDetail from "./components/shared/EventDetail";
import UpdateEvent from "./components/UpdateEvent";
import Profile from "./components/Profile";
import Orders from "./components/Orders";
import SignInPage from "./components/shared/SignInPage";
import ProtectedRoutes from "./components/shared/ProtectedRoutes";

function App() {
  return (
    <Router>
      <div className="font-poppins flex h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/events/:eventId" element={<EventDetail />} />
          </Routes>

          <Routes>
            <Route
              path="/profile"
              element={
                <ProtectedRoutes>
                  <Profile />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoutes>
                  <CreateEvent />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/orders/event/:eventId"
              element={
                <ProtectedRoutes>
                  <Orders />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/events/:eventId/update"
              element={
                <ProtectedRoutes>
                  <UpdateEvent />
                </ProtectedRoutes>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
