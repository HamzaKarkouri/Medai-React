import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || ""); // Retrieve token from localStorage
  const [appointments, setAppointments] = useState([]); // Holds doctor appointments
  const [dashData, setDashData] = useState(null); // Dashboard data
  const [profileData, setProfileData] = useState(null); // Doctor profile data

  /**
   * Fetch Doctor Appointments
   */
  const getAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
        headers: { Authorization: `Bearer ${dToken}` }, // Use Bearer token
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error(error.response?.data?.message || "Failed to fetch appointments.");
    }
  };

  /**
   * Fetch Doctor Profile Data
   */
  const getProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, {
        headers: { Authorization: `Bearer ${dToken}` }, // Use Bearer token
      });

      if (data.success) {
        setProfileData(data.profileData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error(error.response?.data?.message || "Failed to fetch profile data.");
    }
  };

  /**
   * Cancel Appointment
   */
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/cancel-appointment`,
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${dToken}` }, // Use Bearer token
        }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments(); // Refresh appointments
        getDashData(); // Refresh dashboard
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error(error.response?.data?.message || "Failed to cancel appointment.");
    }
  };

  /**
   * Mark Appointment as Completed
   */
  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/complete-appointment`,
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${dToken}` }, // Use Bearer token
        }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments(); // Refresh appointments
        getDashData(); // Refresh dashboard
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error completing appointment:", error);
      toast.error(error.response?.data?.message || "Failed to complete appointment.");
    }
  };

  /**
   * Fetch Doctor Dashboard Data
   */
  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
        headers: { Authorization: `Bearer ${dToken}` }, // Use Bearer token
      });

      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error(error.response?.data?.message || "Failed to fetch dashboard data.");
    }
  };

  // Context value to provide globally
  const value = {
    dToken,
    setDToken,
    backendUrl,
    appointments,
    getAppointments,
    cancelAppointment,
    completeAppointment,
    dashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
  };

  return <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>;
};

export default DoctorContextProvider;
