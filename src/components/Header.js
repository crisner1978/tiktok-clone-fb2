import useAuthUser from "context/userContext";
import InboxIcon from "icons/InboxIcon";
import MessageIcon from "icons/MessageIcon";
import UploadIcon from "icons/UploadIcon";
import { useState } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";
import SearchBar from "./SearchBar";

export default function Header() {
  const [isVisible, setVisible] = useState(false)
  const [user] = useAuthUser();
  const outsideRef = useDetectClickOutside({ onTriggered: () => setVisible(false)})
  
  const toggleDropdown = () => setVisible(!isVisible)

  if (!user) return null;

  return (
    <div className="h-container" ref={outsideRef}>
      <div className="h-content">
        <div className="h-wrapper">
          <Link to="/" className="h-link">
            <img src="/tiktok-logo.svg" alt="Tiktok" className="h-icon" />
          </Link>
        </div>
        <SearchBar />

        <div className="h-menu-right">
          <Link to="/upload" className="h-menu-upload">
            <UploadIcon />
          </Link>

          <MessageIcon />

          <InboxIcon />

          <div className="h-avatar-container" onClick={toggleDropdown}>
            <img src={user.photoURL} alt={user.username} className="h-avatar" />
            {isVisible && (
              <Dropdown user={user} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
