// @ts-nocheck
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

const SpeechInputButton = ({ onResult }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const shouldListenRef = useRef(false);
  const finalTranscriptRef = useRef("");

  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    recognition.onstart = () => {
      console.log("Speech recognition started");
    };

    recognition.onresult = (event) => {
      console.log("Speech result event", event);

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptSegment = event.results[i][0].transcript;
        console.log("Transcript segment:", transcriptSegment);

        finalTranscriptRef.current += " " + transcriptSegment;
      }

      // Live update during recognition
      if (onResult) onResult(finalTranscriptRef.current.trim());
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
      if (shouldListenRef.current) {
        console.log("Restarting speech recognition...");
        recognition.start();
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      console.log("Speech recognition stopped");
    }
  };

  const toggleListening = () => {
    if (!isListening) {
      // START listening
      setIsListening(true);
      shouldListenRef.current = true;

      // Reset transcript for new session
      finalTranscriptRef.current = "";

      startRecognition();
    } else {
      // STOP listening
      setIsListening(false);
      shouldListenRef.current = false;

      // Send final transcript one last time when OFF
      if (onResult) onResult(finalTranscriptRef.current.trim());

      // Now reset
      finalTranscriptRef.current = "";

      stopRecognition();
    }
  };

  return (
    <Button
      type="button"
      variant={isListening ? "destructive" : "outline"}
      onClick={toggleListening}
      className="ml-2"
    >
      {isListening ? "🎙️" : "🎤"}
    </Button>
  );
};

export default SpeechInputButton;
