import React, { useContext, useEffect, useState, useRef } from "react";
import { SongContext } from "../contexts/SongContext";
import "../styles/Lyrics.css";

const Lyrics = () => {
  const { currentTime, updateTime, selectedSong } = useContext(SongContext);
  const [lyrics, setLyrics] = useState([]);
  const [lyricsBgColor, setLyricsBgColor] = useState("#FFF");
  const lyricsContainerRef = useRef(null); 
  const colors = [
    "#181A2F", "#B4182D", "#6BA3BE", "#242E49", "#C48CB3", 
    "#44174E", "#37415C", "#0C969C", "#1B1934"
  ];

  useEffect(() => {
    const randomBgColor = colors[Math.floor(Math.random() * colors.length)];
    setLyricsBgColor(randomBgColor);
  }, []);

  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        const parsedLyrics = parseLrc(selectedSong.lyrics);
        setLyrics(parsedLyrics);
      } catch (error) { 
        console.error("Error loading lyrics:", error);
      }
    };
    fetchLyrics();
  }, [selectedSong]);

  const parseLrc = (lrcText) => {
    const lines = lrcText.split("\n");
    return lines.map((line) => {
      const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
      if (match) {
        const minutes = parseInt(match[1]);
        const seconds = parseFloat(match[2]);
        const time = minutes * 60 + seconds;
        const text = match[3].trim();
        return { time, text };
      }
      return null;
    }).filter(line => line !== null);
  };

  useEffect(() => {
    const activeLineIndex = lyrics.findIndex((line, index) => {
      const nextLine = lyrics[index + 1];
      return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
    });

    if (activeLineIndex !== -1 && lyricsContainerRef.current) {
      const activeLine = lyricsContainerRef.current.children[activeLineIndex];
      if (activeLine) {
        const targetScrollTop = activeLine.offsetTop - lyricsContainerRef.current.clientHeight / 2 + activeLine.clientHeight / 2;
        smoothScroll(lyricsContainerRef.current, targetScrollTop, 500); 
      }
    }
  }, [currentTime, lyrics]);

  const smoothScroll = (element, target, duration) => {
    const start = element.scrollTop;
    const distance = target - start;
    const startTime = performance.now();

    const step = (currentTime) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      element.scrollTop = start + distance * progress;

      if (timeElapsed < duration) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  return (
    <div
    className="lyrics"
    id="lyricsContainer"
    style={{ backgroundColor: lyricsBgColor }}
    ref={lyricsContainerRef}
  >
    {lyrics.map((line, index) => {
      let lineClass = "";
      if (currentTime >= line.time && (!lyrics[index + 1] || currentTime < lyrics[index + 1].time)) {
        lineClass = "current-line"; 
      } else if (currentTime > line.time) {
        lineClass = "past-line"; 
      } else {
        lineClass = "future-line"; 
      }

      return (
        <p key={index} className={lineClass} onClick={() => updateTime(line.time)} >
          {line.text}
        </p>
      );
    })}
  </div>
  );
};

export default Lyrics;
