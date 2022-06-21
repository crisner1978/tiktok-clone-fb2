import PauseIcon from "icons/PauseIcon";
import PlayIcon from "icons/PlayIcon";

export default function PauseButton({ isPlaying, togglePlay }) {
  return (
    <button className="pause-button" onClick={togglePlay}>
      {!isPlaying ? <PlayIcon /> : <PauseIcon />}
    </button>
  );
}
