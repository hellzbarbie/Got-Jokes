import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

const synth = window.speechSynthesis;

function App() {
  const [joke, setJoke] = useState('');
  const [recognition, setRecognition] = useState(null);
  const handleGenerateJoke = async () => {
    try {
      const res = await axios.get('https://v2.jokeapi.dev/joke/Any');
      if (res.data && res.data.joke) {
        setJoke(res.data.joke);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Perform an action when a key is pressed
      if (event.key === 'j') {
        if (synth.speaking) {
          console.error('Already speaking...');
          return;
        }

        if (joke) {
          speak(joke);
        }
      }

      // You can perform other actions here
    };

    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [joke, synth]);

  const speak = (jokeString) => {
    const speakText = new SpeechSynthesisUtterance(jokeString);

    speakText.onend = (e) => {
      console.log('Done');
    };
    speakText.onerror = (e) => {
      console.error('Something went wrong');
    };
    synth.speak(speakText);
  };

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      // Create a SpeechRecognition instance
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = false; // Set to true for continuous recognition
      recognitionInstance.lang = 'en-US'; // Set the language for recognition

      recognitionInstance.onresult = (event) => {
        const result = event.results[0][0].transcript;
        const hasKeyWord = /tell.*joke|joke/i.test(result);
        if (hasKeyWord) {
          handleGenerateJoke();
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const startRecognition = () => {
    if (recognition) {
      recognition.start();
    } else {
      console.error('Speech recognition not supported in this browser.');
    }
  };

  return (
    <div className='App bg-gradient-to-br from-blue-200 to-blue-400 w-full h-screen flex justify-center'>
      <section>
        <div className='flex justify-center'>
          <img src={require("./bot.gif")} className='h-[256px]' alt='bot' />
        </div>
        <div className='flex gap-4 w-fit mx-auto'>
          <button
            onClick={handleGenerateJoke}
            className='bg-blue-500 rouded-lg px-3 py-1 text-lg text-white font-mono cursor-pointer hover:scale-105 duration-150'
            >
              Got Jokes?
            </button>
            <button
              onClick={startRecognition}
              className='bg-blue-500 rounded-lg px-3 py-1 text-lg text-white font-mono cursor-pointer hover:scale-105 duration-150'
              >
                <i className='fa-solid fa-microphone' />
              </button>
        </div>
        <p className='font-mono font-bold text-xl mt-4'>{joke}</p>
      </section>
    </div>
  );
}

export default App;