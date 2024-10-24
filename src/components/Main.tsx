"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Share2, Trash2, Play } from "lucide-react";

export default function MainComponent() {
  const [screen, setScreen] = useState("start");
  const [countdown, setCountdown] = useState(3);
  const [isHovered, setIsHovered] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [recording, setRecording] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isStopped, setIsStopped] = useState(false);
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (screen === "countdown" && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (screen === "countdown" && countdown === 0) {
      setScreen("final");
      setRecording(true); // Start recording when countdown is 0
    }
    return () => clearTimeout(timer);
  }, [screen, countdown]);

  const handleClick = () => {
    if (screen === "start") {
      // Request microphone access
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          setScreen("countdown");
          setCountdown(3);
          setErrorMessage(""); // Clear any previous error messages
        })
        .catch((error) => {
          // Handle error (permission denied or unavailable)
          setErrorMessage("Microphone access is required to record.");
        });
    } else if (screen === "final") {
      setIsStopped(true);
      setRecording(false); // Stop recording when user clicks stop
      setShowOptions(true);
    }
  };

  const handleResume = () => {
    setIsStopped(false);
    setShowOptions(false);
    setRecording(true); // Resume recording
  };

  const handleDelete = () => {
    setScreen("start");
    setShowOptions(false);
    setRecording(false); // Stop recording on delete
  };

  return (
    <div className="min-h-screen w-full bg-[#2c3e50] flex flex-col items-center justify-center overflow-hidden relative">
      {/* Main border */}

      <div className="absolute inset-12 border border-[#f39c12]/20 rounded-lg" />

      {/* Background dots (only show when recording) */}
      {recording && (
        <div className="absolute inset-12 overflow-hidden border-[#f39c12] rounded-lg">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full opacity-20"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {screen === "start" && (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex items-center justify-center"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <motion.div
              className="absolute border border-[#f39c12] rounded-full"
              style={{
                width: "200px",
                height: "200px",
              }}
              animate={isHovered ? { opacity: 0 } : { opacity: 1 }}
            />
            {isHovered &&
              [0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="absolute border border-[#f39c12] rounded-full"
                  style={{
                    width: `${200 + index * 40}px`,
                    height: `${200 + index * 40}px`,
                  }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                  }}
                />
              ))}
            <motion.button
              className="relative z-10 w-40 h-40 bg-transparent text-[#f39c12] rounded-full flex items-center justify-center text-2xl font-light cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClick}
            >
              Babble
            </motion.button>
          </motion.div>
        )}

        {screen === "countdown" && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="w-40 h-40 bg-white rounded-full flex items-center justify-center"
          >
            <span className="text-[#2c3e50] text-6xl font-bold">
              {countdown}
            </span>
          </motion.div>
        )}

        {screen === "final" && (
          <motion.div
            key="final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Enhanced Wave Layers (only show when recording) */}
              {recording &&
                [1, 2, 3].map((index) => (
                  <svg
                    key={index}
                    className="absolute w-full h-full"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id={`waveGradient${index}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop
                          offset="0%"
                          stopColor="#f1c40f"
                          stopOpacity={0.9 - index * 0.2}
                        />
                        <stop
                          offset="50%"
                          stopColor="#f39c12"
                          stopOpacity={0.9 - index * 0.2}
                        />
                        <stop
                          offset="100%"
                          stopColor="#f1c40f"
                          stopOpacity={0.9 - index * 0.2}
                        />
                      </linearGradient>
                    </defs>
                    <motion.path
                      fill={`url(#waveGradient${index})`}
                      initial={{
                        d: "M0,192L48,192C96,192,192,192,288,192C384,192,480,192,576,192C672,192,768,192,864,192C960,192,1056,192,1152,192C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                      }}
                      animate={{
                        d: [
                          "M0,160L60,181.3C120,203,240,245,360,234.7C480,224,600,160,720,144C840,128,960,160,1080,181.3C1200,203,1320,213,1380,218.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z",
                          "M0,224L60,213.3C120,203,240,181,360,186.7C480,192,600,224,720,240C840,256,960,256,1080,234.7C1200,213,1320,171,1380,149.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z",
                        ],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </svg>
                ))}

              {!isStopped && (
                <motion.div
                  className="relative z-10 flex flex-col items-center space-y-4"
                  key="stop-delete-column"
                >
                  {/* Stop button */}
                  <motion.button
                    key="stop"
                    className="w-40 h-40 bg-white text-black rounded-full flex items-center justify-center text-2xl font-bold cursor-pointer shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClick}
                  >
                    Stop
                  </motion.button>

                  {/* Delete button */}
                  <motion.button
                    className="w-14 h-14 bg-white text-red-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDelete}
                  >
                    <Trash2 size={24} />
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOptions && (
          <motion.div
            key="options"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex flex-col items-center justify-center z-20 space-y-4"
          >
            <div className="flex space-x-4">
              <motion.button
                className="w-32 h-32 bg-white text-black rounded-full flex items-center justify-center text-xl font-bold cursor-pointer shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDelete}
              >
                Done
              </motion.button>

              <motion.button
                className="w-28 h-28 bg-[#f39c12] text-white rounded-full flex items-center justify-center text-xl font-bold cursor-pointer shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResume}
              >
                Resume
              </motion.button>
            </div>

            <motion.button
              className="w-14 h-14 bg-white text-red-500 rounded-full flex items-center justify-center mt-4 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
            >
              <Trash2 size={24} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {errorMessage && (
        <div className="absolute bottom-8 text-red-500">{errorMessage}</div>
      )}
    </div>
  );
}
