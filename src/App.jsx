import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Appointment from "./pages/Appointment";
import Contact from "./pages/Contact";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import Doctors from "./pages/Doctors";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyAppointments from "./pages/MyAppointments";
import MyProfile from "./pages/MyProfile";
import Verify from "./pages/Verify";
import VideoCall from "./pages/VideoCall";
import DoctorContextProvider from "./context/DoctorContext"; // Import DoctorContextProvider
import VideoCallDoctor from "./pages/VideoCallDoctor";

const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route
          path="/doctordashboard"
          element={
            <DoctorContextProvider>
              <DoctorDashboard />
            </DoctorContextProvider>
          }
        />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/appointment/:docId" element={<Appointment />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/video-call" element={<VideoCall />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/video-call-doctor/:appointmentId" element={<VideoCallDoctor />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
