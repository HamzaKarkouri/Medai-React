import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

const VideoCall = () => {
  const [searchParams] = useSearchParams();
  const roomName = searchParams.get('roomName') || 'default-room';
  const userDisplayName = 'Patient'; // Replace with the actual user's name
  const jitsiContainerRef = useRef(null);

  useEffect(() => {
    // Ensure Jitsi Meet API script is available
    const domain = 'meet.jit.si';
    const options = {
      roomName: roomName,
      parentNode: jitsiContainerRef.current,
      userInfo: {
        displayName: userDisplayName,
      },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
      },
    };
    const api = new window.JitsiMeetExternalAPI(domain, options);

    return () => {
      api.dispose(); // Cleanup on component unmount
    };
  }, [roomName, userDisplayName]);

  return (
    <div style={{ height: '100vh', width: '100%' }} ref={jitsiContainerRef}></div>
  );
};

export default VideoCall;
