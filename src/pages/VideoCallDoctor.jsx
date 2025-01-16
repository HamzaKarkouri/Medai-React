import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const VideoCallDoctor = () => {
  const { appointmentId } = useParams();

  useEffect(() => {
    const domain = "meet.jit.si";
    const options = {
      roomName: `Appointment-${appointmentId}`,
      width: "100%",
      height: 500,
      parentNode: document.querySelector("#jitsi-container"),
      userInfo: {
        displayName: "Doctor",
      },
    };

    const api = new window.JitsiMeetExternalAPI(domain, options);

    api.addEventListener("videoConferenceJoined", () => {
      console.log("Jitsi meeting started");
    });

    api.addEventListener("videoConferenceLeft", () => {
      console.log("Jitsi meeting ended");
    });

    return () => {
      api.dispose();
    };
  }, [appointmentId]);

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-5">Video Call</h2>
      <div id="jitsi-container" style={{ height: "500px" }}></div>
    </div>
  );
};

export default VideoCallDoctor;
