import React, { useState, useRef, useEffect } from 'react';

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [duration, setDuration] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);
  const intervalRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Clean up previous recording
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
        setAudioURL(null);
      }
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        // Stop the stream tracks to turn off the microphone light
        if (audioStreamRef.current) {
            audioStreamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      setDuration(0);
      startDurationCounter();

    } catch (err) {
      console.error('Error starting recording:', err);
      alert('ບໍ່ສາມາດເລີ່ມການບັນທຶກໄດ້: ' + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      stopDurationCounter();
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      stopDurationCounter();
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      startDurationCounter();
    }
  };

  const startDurationCounter = () => {
    intervalRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
  };

  const stopDurationCounter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const formatDuration = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (audioURL) {
      const link = document.createElement('a');
      link.href = audioURL;
      link.download = `recording_${new Date().toISOString()}.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">ເຄື່ອງມືບັນທຶກສຽງ</h2>
      <div className="card p-4 shadow-sm text-center">
        <div className="mb-4">
          <p className="display-4 fw-bold">{formatDuration(duration)}</p>
        </div>
        <div className="d-grid gap-2 col-6 mx-auto">
          {!isRecording && (
            <button className="btn btn-success btn-lg" onClick={startRecording}>
              <i className="bi bi-mic-fill me-2"></i> ເລີ່ມບັນທຶກ
            </button>
          )}
          {isRecording && !isPaused && (
            <>
              <button className="btn btn-warning btn-lg" onClick={pauseRecording}>
                <i className="bi bi-pause-fill me-2"></i> ຢຸດຊົ່ວຄາວ
              </button>
              <button className="btn btn-danger btn-lg" onClick={stopRecording}>
                <i className="bi bi-stop-fill me-2"></i> ຢຸດ
              </button>
            </>
          )}
          {isRecording && isPaused && (
            <>
              <button className="btn btn-info btn-lg" onClick={resumeRecording}>
                <i className="bi bi-play-fill me-2"></i> ຫຼິ້ນຕໍ່
              </button>
              <button className="btn btn-danger btn-lg" onClick={stopRecording}>
                <i className="bi bi-stop-fill me-2"></i> ຢຸດ
              </button>
            </>
          )}
        </div>

        {audioURL && (
          <div className="mt-4">
            <h3>ສຽງທີ່ບັນທຶກ:</h3>
            <audio controls src={audioURL} className="w-100 mb-3"></audio>
            <button className="btn btn-primary" onClick={handleDownload}>
              <i className="bi bi-download me-2"></i> ດາວໂຫຼດສຽງ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;