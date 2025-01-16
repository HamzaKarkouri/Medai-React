import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currencySymbol = "MAD ";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]); // Stores list of doctors
  const [token, setToken] = useState(localStorage.getItem("token") || ""); // User token
  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || ""); // Doctor token
  const [userData, setUserData] = useState(null); // User data
  const [loading, setLoading] = useState(false); // Loading state

  /**
   * Formats dates for display.
   * @param {string} dateString - Date string to format.
   * @returns {string} - Formatted date string.
   */
  const slotDateFormat = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  /**
   * Fetches the list of doctors from the backend.
   */
  const getDoctorsData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to fetch doctors.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Loads the user profile data.
   */
  const loadUserProfileData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: { token },
      });
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      toast.error("Failed to load user profile.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Loads the doctor profile data.
   */
  const loadDoctorProfileData = async () => {
    if (!dToken) {
      console.error("No doctor token available.");
      return;
    }
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      if (data.success) {
        console.log("Doctor profile data:", data.profileData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching doctor profile:", error.response?.data || error.message);
      toast.error("Failed to fetch doctor profile.");
    }
  };

  /**
   * Logs the user out by clearing tokens and user data.
   */
  const logout = () => {
    setToken("");
    setDToken("");
    setUserData(null);
    localStorage.removeItem("token");
    localStorage.removeItem("dToken");
    toast.success("Logged out successfully.");
  };

  // Fetch user profile data when the user token changes
  useEffect(() => {
    if (token) {
      loadUserProfileData();
    }
  }, [token]);

  // Fetch doctor profile data when the doctor token changes
  useEffect(() => {
    if (dToken) {
      loadDoctorProfileData();
    }
  }, [dToken]);

  // Fetch doctors data on initial load
  useEffect(() => {
    getDoctorsData();
  }, []);

  // Provide all state and functions to the context consumers
  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    backendUrl,
    token,
    setToken,
    dToken,
    setDToken,
    userData,
    setUserData,
    slotDateFormat, // Added slotDateFormat function
    loading,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
