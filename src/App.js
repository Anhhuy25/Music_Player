import React, { useEffect, useRef, useState } from "react";
import Playlist from "./components/Playlist";
import infoSongs from "./songs";

const getLocalStorageCurrentIndex = () => {
  let currentIndex = localStorage.getItem("currentIndex");

  if (currentIndex) {
    return JSON.parse(localStorage.getItem("currentIndex"));
  } else {
    return 0;
  }
};

const getLocalStorageIsRandom = () => {
  let isRandom = localStorage.getItem("isRandom");

  if (isRandom) {
    return JSON.parse(localStorage.getItem("isRandom"));
  } else {
    return false;
  }
};

const getLocalStorageIsRepeat = () => {
  let isRepeat = localStorage.getItem("isRepeat");

  if (isRepeat) {
    return JSON.parse(localStorage.getItem("isRepeat"));
  } else {
    return false;
  }
};

const getLocalStorageValue = () => {
  let value = localStorage.getItem("value");

  if (value) {
    return JSON.parse(localStorage.getItem("value"));
  } else {
    return 0;
  }
};

function App() {
  const songs = infoSongs;
  const [currentIndex, setCurrentIndex] = useState(
    getLocalStorageCurrentIndex()
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRandom, setIsRandom] = useState(getLocalStorageIsRandom());
  const [isRepeat, setIsRepeat] = useState(getLocalStorageIsRepeat());
  const [value, setValue] = useState(getLocalStorageValue());

  const btnPlayRef = useRef(null);
  const audioRef = useRef(null);
  const inputRef = useRef(null);
  const cdThumbRef = useRef(null);
  const nameSongRef = useRef(null);
  const playerRef = useRef(null);
  const activeSong = useRef(null);
  const dashboardRef = useRef(null);
  const cdRef = useRef(null);
  const volumeRef = useRef(null);

  // Chua xong
  const scrollToTopActiveSong = () => {
    // activeSong.current.scrollIntoView({
    //   behavior: "smooth",
    //   block: "nearest",
    //   inline: "end",
    // });
  };

  const chooseSong = (id) => {
    setCurrentIndex((oldCurrentIndex) => {
      if (oldCurrentIndex !== id) {
        oldCurrentIndex = id - 1;
      } else {
        oldCurrentIndex = id - 1;
      }
      return oldCurrentIndex;
    });
  };

  const handleChangeSeek = (e) => {
    const seekTime = (audioRef.current.duration / 100) * e.target.value;
    audioRef.current.currentTime = seekTime;
  };

  const handleChangeVolume = (e) => {
    setValue(e.target.value);
    audioRef.current.volume = e.target.value / 100;
  };

  const prevSong = () => {
    if (isRandom) {
      setCurrentIndex(Math.floor(Math.random() * songs.length));
    } else {
      if (currentIndex <= 0) {
        setCurrentIndex(songs.length - 1);
      } else {
        setCurrentIndex(currentIndex - 1);
      }
    }
    setIsPlaying(true);
  };

  const nextSong = () => {
    if (isRandom) {
      setCurrentIndex(Math.floor(Math.random() * songs.length));
    } else {
      if (currentIndex >= songs.length - 1) {
        setCurrentIndex(0);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }
    setIsPlaying(true);

    if (currentIndex > 1) {
      scrollToTopActiveSong();
    }
  };

  useEffect(() => {
    // Load bài hát đầu tiên ra UI khi chạy ứng dụng
    const loadCurrentSong = () => {
      nameSongRef.current.textContent = songs[currentIndex].name;
      cdThumbRef.current.style.backgroundImage = `url(${songs[currentIndex].image})`;
      audioRef.current.src = songs[currentIndex].link;
      if (value === 0) {
        audioRef.current.volume = 0;
      } else {
        audioRef.current.volume = value / 100;
      }
    };
    loadCurrentSong();
    // eslint-disable-next-line
  }, [currentIndex]);

  useEffect(() => {
    // Xử lí hình ảnh đĩa khi scroll lên-xuống
    const handleScrollTop = () => {
      const cdWidth = cdRef.current.offsetWidth;
      document.onscroll = function () {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const newcdWidth = cdWidth - scrollTop;
        cdRef.current.style.width = newcdWidth > 0 ? newcdWidth + "px" : 0;
        cdRef.current.style.opacity = newcdWidth / cdWidth;
      };
    };
    handleScrollTop();
  }, []);

  useEffect(() => {
    // const cdThumbAnimate = cdThumbRef.current.animate([{ transform: "rotate(360deg)" }], {
    //   duration: 10000,
    //   iterations: Infinity,
    // });
    // cdThumbAnimate.pause();
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }

    audioRef.current.ontimeupdate = function () {
      if (audioRef.current.duration) {
        const currentProgress = Math.floor(
          (audioRef.current.currentTime / audioRef.current.duration) * 100
        );
        inputRef.current.value = currentProgress;
      }
    };

    audioRef.current.onended = function () {
      if (isRepeat) {
        audioRef.current.play();
      } else {
        nextSong();
      }
    };
  });

  useEffect(() => {
    localStorage.setItem("isRandom", JSON.stringify(isRandom));
    localStorage.setItem("isRepeat", JSON.stringify(isRepeat));
    localStorage.setItem("currentIndex", JSON.stringify(currentIndex));
    localStorage.setItem("value", JSON.stringify(value));
  }, [isRandom, isRepeat, currentIndex, value]);

  return (
    <div
      className={`player ${isPlaying ? "playing" : ""}`}
      // className='player'
      ref={playerRef}
    >
      {/* Dashboard */}
      <div className="dashboard" ref={dashboardRef}>
        {/* Header */}
        <header>
          <h4>Now playing:</h4>
          <h2 ref={nameSongRef}>Hello</h2>
        </header>

        {/* CD */}
        <div className="cd" ref={cdRef}>
          <div ref={cdThumbRef} className="cd-thumb"></div>
        </div>

        {/* Control */}
        <div className="control">
          <button
            className={`btn btn-repeat ${isRepeat ? "active" : ""}`}
            onClick={() => setIsRepeat(!isRepeat)}
          >
            <i className="fas fa-redo"></i>
          </button>
          <button className="btn">
            <i className="far fa-heart"></i>
          </button>
          <button className="btn btn-prev" onClick={prevSong}>
            <i className="fas fa-step-backward"></i>
          </button>
          <button
            className="btn btn-toggle-play"
            ref={btnPlayRef}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            <i className="fas fa-pause icon-pause"></i>
            <i className="fas fa-play icon-play"></i>
          </button>
          <button className="btn btn-next" onClick={nextSong}>
            <i className="fas fa-step-forward"></i>
          </button>
          <div className="btn">
            <i
              className={value > 0 ? "fas fa-volume-up" : "fas fa-volume-mute"}
            >
              <input
                onChange={handleChangeVolume}
                ref={volumeRef}
                type="range"
                min={0}
                max={100}
                value={value}
                step={1}
              />
            </i>
          </div>
          <button
            className={`btn btn-random ${isRandom ? "active" : ""}`}
            onClick={() => setIsRandom(!isRandom)}
          >
            <i className="fas fa-random"></i>
          </button>
        </div>

        <input
          ref={inputRef}
          onChange={handleChangeSeek}
          className="progress"
          type="range"
          value="0"
          step="1"
          min="0"
          max="100"
        />

        <audio ref={audioRef} src=""></audio>
      </div>

      {/* Playlist */}
      <Playlist
        activeSong={activeSong}
        songs={songs}
        chooseSong={chooseSong}
        currentIndex={currentIndex}
      />
    </div>
  );
}

export default App;
