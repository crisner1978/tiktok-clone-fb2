import useAuthUser from "context/userContext";
import { useHistory } from "react-router-dom";

const MyPostTag = () => {
  const [user] = useAuthUser();
  const history = useHistory();
  return (
    <div className="mp-container">
      <div className="mp-wrapper">
        <button
          className="ufb"
          style={{
            backgroundColor: "#ffffff",
            borderColor: "#000000",
            color: "#000000",
          }}
          onClick={() => history.push(`/${user.username}`)}>
          My post
        </button>
      </div>
    </div>
  );
};

export default MyPostTag;
