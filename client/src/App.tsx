import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/shared/Footer";
import Header from "./components/shared/Header";
import Home from "./components/Home";
import CreateEvent from "./components/CreateEvent";
import EventDetail from "./components/shared/EventDetail";
import UpdateEvent from "./components/UpdateEvent";

function App() {
  return (
    <Router>
      <div className="font-poppins flex h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateEvent />} />
            <Route path="/events/:eventId" element={<EventDetail />} />
            <Route path="/events/:eventId/update" element={<UpdateEvent />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
