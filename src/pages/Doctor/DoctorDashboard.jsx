import { useContext, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext"; // App-level context
import {
  AttachMoney,
  CalendarToday,
  People,
  Assignment,
  Done,
  Cancel,
  Videocam,
} from "@mui/icons-material"; // Material UI icons
import { CircularProgress, Tooltip } from "@mui/material";

const DoctorDashboard = () => {
  const { dToken, backendUrl } = useContext(AppContext); // Context values
  const navigate = useNavigate(); // For navigation
  const [doctorProfile, setDoctorProfile] = useState(null); // Doctor profile state
  const [dashData, setDashData] = useState(null); // Dashboard data state
  const [loading, setLoading] = useState(false); // Loading state
  const [showJoinCall, setShowJoinCall] = useState({}); // Track "Join Call" button visibility

  /**
   * Fetch doctor dashboard data.
   */
  const getDashData = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        console.error("Error fetching dashboard data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error.response?.data || error.message);
    }
  }, [backendUrl, dToken]);

  /**
   * Fetch doctor profile and dashboard data.
   */
  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!dToken) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // Fetch doctor profile
        const { data: profileResponse } = await axios.get(`${backendUrl}/api/doctor/profile`, {
          headers: { Authorization: `Bearer ${dToken}` },
        });
        if (profileResponse.success) {
          setDoctorProfile(profileResponse.profileData);
          console.log("Doctor profile data:", profileResponse.profileData);
        } else {
          console.error("Error fetching doctor profile:", profileResponse.message);
        }

        // Fetch dashboard data
        await getDashData();
      } catch (error) {
        console.error("Error fetching doctor data:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [dToken, backendUrl, getDashData]);

  const handleVerify = (appointmentId) => {
    setShowJoinCall((prev) => ({ ...prev, [appointmentId]: true }));
  };

  const handleJoinCall = (appointmentId) => {
    console.log("Joining call for appointment:", appointmentId);
    navigate("/videocalldoctor"); // Redirect to VideoCallDoctor page
  };

  if (loading) return <div className="text-center mt-5"><CircularProgress /></div>;

  if (!doctorProfile || !dashData)
    return <div className="text-center">No data available. Please log in as a doctor.</div>;

  return (
    <div className="m-5">
      <h1 className="text-2xl font-bold mb-5">Welcome, Dr. {doctorProfile.name}</h1>
      <div className="flex flex-wrap gap-3">
        <Tooltip title="Total Earnings">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all shadow-md">
            <AttachMoney className="text-green-500 text-4xl" />
            <div>
              <p className="text-xl font-semibold text-gray-600">{dashData.earnings} MAD</p>
              <p className="text-gray-400">Total Earnings</p>
            </div>
          </div>
        </Tooltip>
        <Tooltip title="Total Appointments">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all shadow-md">
            <CalendarToday className="text-blue-500 text-4xl" />
            <div>
              <p className="text-xl font-semibold text-gray-600">{dashData.appointments}</p>
              <p className="text-gray-400">Total Appointments</p>
            </div>
          </div>
        </Tooltip>
        <Tooltip title="Total Patients">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all shadow-md">
            <People className="text-purple-500 text-4xl" />
            <div>
              <p className="text-xl font-semibold text-gray-600">{dashData.patients}</p>
              <p className="text-gray-400">Total Patients</p>
            </div>
          </div>
        </Tooltip>
      </div>

      <div className="bg-white mt-10 shadow-md rounded">
        <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border-b">
          <Assignment className="text-gray-500" />
          <p className="font-semibold text-gray-700">Latest Bookings</p>
        </div>
        <div className="pt-4">
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div
              className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100 border-b"
              key={index}
            >
              <img
                className="rounded-full w-10 h-10"
                src={item.userData.image || "https://via.placeholder.com/40"}
                alt="Patient"
              />
              <div className="flex-1 text-sm">
                <p className="text-gray-800 font-medium">{item.userData.name || "Unknown"}</p>
                <p className="text-gray-600">
                  Booking on {item.slotDate ? new Date(item.slotDate).toLocaleDateString() : "Invalid Date"}
                </p>
              </div>
              {item.cancelled ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : showJoinCall[item._id] ? (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
                  onClick={() => handleJoinCall(item._id)}
                >
                  Join Call
                </button>
              ) : (
                <div className="flex gap-2">
                  <Cancel
                    className="text-red-500 cursor-pointer"
                    onClick={() => console.log("Cancel:", item._id)}
                  />
                  <Done
                    className="text-green-500 cursor-pointer"
                    onClick={() => {
                      console.log("Joining call for appointment:", item._id);
                      navigate(`/video-call-doctor/${item._id}`);
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
