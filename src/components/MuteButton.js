import MuteIcon from "icons/MuteIcon";
import SoundIcon from "icons/SoundIcon";

export default function MuteButton({ isMuted, toggleMute }) {
  return (
    <button onClick={toggleMute} className="mute-button">
      <div className="mute-button-inner">
        {!isMuted ? <MuteIcon /> : <SoundIcon />}
      </div>
    </button>
  );
}
