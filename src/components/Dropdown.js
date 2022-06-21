import useAuthUser from "context/userContext";
import BusinessSuiteIcon from "icons/BusinessSuiteIcon";
import FeedbackIcon from "icons/FeedbackIcon";
import GetCoinsIcon from "icons/GetCoinsIcon";
import LanguageIcon from "icons/LanguageIcon";
import LogOutIcon from "icons/LogOutIcon";
import SettingsIcon from "icons/SettingsIcon";
import ShortcutsIcon from "icons/ShortcutsIcon";
import ViewProfileIcon from "icons/ViewProfileIcon";
import { auth } from "lib/firebase";
import { useHistory } from "react-router-dom";

export default function Dropdown() {
  const history = useHistory();
  const [user] = useAuthUser()

  async function logOut() {
    await auth.signOut();
    window.location.reload();
  }

  return (
    <div className="dd-container">
      <img src="/dropdown-arrow.svg" alt="Arrow" className="dd-arrow" />
      <div className="dd-wrapper">
        <DropdownOption
          icon={<ViewProfileIcon />}
          text="View Profile"
          onClick={() => history.push(`/${user.username}`)}
        />
        <DropdownOption
          icon={<GetCoinsIcon />}
          text="Get Coins"
        />
        <DropdownOption
          icon={<BusinessSuiteIcon />}
          text="Business Suite"
        />
        <DropdownOption
          icon={<SettingsIcon />}
          text="Settings"
        />
        <DropdownOption
          icon={<LanguageIcon />}
          text="English"
        />
        <DropdownOption
          icon={<FeedbackIcon />}
          text="Feedback"
        />
        <DropdownOption
          icon={<ShortcutsIcon />}
          text="Keyboard shortcuts"
        />
        <DropdownOption
          icon={<LogOutIcon />}
          text="Log out"
          onClick={logOut}
        />
      </div>
    </div>
  );
}

function DropdownOption({ icon, text, onClick, border }) {
  return (
    <div className="dd-option-container" onClick={onClick}>
      {border && <hr className="dd-option-border" />}
      <span className="dd-option">
        {icon}
        {text}
      </span>
    </div>
  );
}
