import React, { useState, useEffect } from 'react';
import './Te.css';

const TranscriptEditor = ({ initialTranscript }) => {
  const [transcript, setTranscript] = useState(initialTranscript);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingWord, setEditingWord] = useState('');

  const totalDuration = transcript.reduce((acc, wordObj) => {
    return Math.max(acc, wordObj.start_time + wordObj.duration);
  }, 0);

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          const newTime = prevTime + 100;
          if (newTime >= totalDuration) {
            setIsPlaying(false);
            clearInterval(interval);
            return totalDuration;
          }
          return newTime;
        });
      }, 100);
    } else if (!isPlaying && currentTime !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, totalDuration]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlereset = () => {
    setCurrentTime(0);
  };

  const handleWordClick = (index, word) => {
    setEditingIndex(index);
    setEditingWord(word);
  };

  const handleWordChange = (e) => {
    const newWord = e.target.value;

    // Prevent the word from being deleted entirely
    if (newWord.trim().length > 0) {
      setEditingWord(newWord);
    }
  };

  const handleWordBlur = () => {
    const updatedTranscript = transcript.map((wordObj, i) =>
      i === editingIndex ? { ...wordObj, word: editingWord } : wordObj
    );
    setTranscript(updatedTranscript);
    setEditingIndex(null);
  };

  return (
    <div className="p-4 flex flex-col align-top" style={{"backgroundColor":"#BB8493","height":"85vh"}}>
      <div className="flex space-x-4 m-4">
        <button 
          className=" text-white px-4 py-2 rounded" style={{"backgroundColor":"#704264"}}
          onClick={handlePlayPause}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button 
          className=" text-white px-4 py-2 rounded" style={{"backgroundColor":"#704264"}}
          onClick={handlereset}
        >
          Reset
        </button>
        <span style={{"color":"#FEF3E2"}} className='p-4'>Current Time: {currentTime} ms</span>
      </div>
      <div className="prose"> 
        <p className="border-solid border-4  p-4 m-5" style={{"backgroundColor":"#5D0E41","borderColor":"#EABE6C"}} > 
          {transcript.map((wordObj, index) => (
            <span
              key={index}
              className={`inline ${currentTime >= wordObj.start_time && currentTime < wordObj.start_time + wordObj.duration ? 'background-highlight' : ''}`} style={{"color":"#FEF3E2"}}
            >
              {editingIndex === index ? (
                <input 
                  type="text" 
                  value={editingWord}
                  onChange={handleWordChange}
                  onBlur={handleWordBlur}
                  className="bg-transparent border-b border-gray-500 outline-none"
                  autoFocus
                />
              ) : (
                <span onClick={() => handleWordClick(index, wordObj.word)}>
                  {wordObj.word}{' '}
                </span>
              )}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
};

export default TranscriptEditor;
