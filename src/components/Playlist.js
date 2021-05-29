import "../index.css";

function Playlist({ songs, chooseSong, currentIndex, activeSong }) {
  return (
    <div className='playlist'>
      {songs.map((song) => {
        return (
          <div
            className={`song ${currentIndex === song.id - 1 ? "active" : ""}`}
            key={song.id}
            onClick={() => chooseSong(song.id)}
            ref={activeSong}
          >
            <div
              className='thumb'
              style={{
                backgroundImage: `url(${song.image})`,
              }}
            ></div>
            <div className='body'>
              <h3 className='title'>{song.name}</h3>
              <p className='author'>{song.artist}</p>
            </div>
            <div className='option'>
              <i className='fas fa-ellipsis-h'></i>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Playlist;
