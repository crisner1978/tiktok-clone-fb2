import useAuthUser from "context/userContext";
import FollowingIcon from "icons/FollowingIcon";
import ForYouIcon from "icons/ForYouIcon";
import LiveIcon from "icons/LiveIcon";
import db from "lib/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sb-container">
      <div className="sb-wrapper">
        <div className="sb-inner">
          <SidebarLinks />
          <SidebarSuggested />
          <SidebarFollowing />
        </div>
      </div>
    </div>
  );
}

function SidebarLinks() {
  return (
    <div className="sb-links-container">
      <Link className="sb-links-wrapper" to="/">
        <ForYouIcon />
        <h2 className="sb-links-text active">For You</h2>
      </Link>
      <Link className="sb-links-wrapper">
        <FollowingIcon />
        <h2 className="sb-links-text">Following</h2>
      </Link>
      <Link className="sb-links-wrapper">
        <LiveIcon />
        <h2 className="sb-links-text">LIVE</h2>
      </Link>
    </div>
  );
}

function SidebarSuggested() {
  const [user] = useAuthUser();
  const [suggestedCol, loading] = useCollection(
    db.collection("users").where("uid", "!=", user?.uid).limit(5)
  );

  const suggested = suggestedCol?.docs.map((doc) => ({
    id: doc.id,
    ref: doc.ref,
    ...doc.data(),
  }));

  const [followingCol] = useCollection(
    user?.ref.collection("following")
  );

  const following = followingCol?.docs.map((doc) => ({
    id: doc.id,
    ref: doc.ref,
    ...doc.data(),
  }));

  let filteredSuggestions = suggested?.filter((array) => {
    return following?.filter((newArr) => {
      return array.id === newArr.id
    }).length === 0
  })

if (loading || suggestedCol.empty || filteredSuggestions.length === 0) return null;

return (
  <div className="sb-suggested">
    <p className="sb-suggested-title">Suggested accounts</p>
    <div className="sb-suggested-list">
      {filteredSuggestions.map((user) => (
        <SidebarItem key={user.id} user={user} />
      ))}
    </div>
  </div>
);
}

function SidebarFollowing() {
  const [user] = useAuthUser();
  const [followingCol, loading] = useCollection(
    user?.ref.collection("following")
  );

  const following = followingCol?.docs.map((doc) => ({
    id: doc.id,
    ref: doc.ref,
    ...doc.data(),
  }));

  if (loading || followingCol.empty) return null;

  return (
    <div className="sb-suggested">
      <p className="sb-suggested-title">Following accounts</p>
      <div className="sb-suggested-list">
        {following.map((user) => (
          <SidebarItem key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

function SidebarItem({ user }) {
  return (
    <Link to={`/${user.username}`} className="sb-item-link">
      <div className="sb-item-avatar-container">
        <span className="sb-item-avatar-wrapper">
          <img
            src={user.photoURL}
            alt={user.username}
            className="sb-item-avatar"
          />
        </span>
      </div>
      <div className="sb-item-info">
        <div className="sb-item-username-wrapper">
          <h4 className="sb-item-username">{user.username}</h4>
        </div>
        <p className="sb-item-displayName">{user.displayName}</p>
      </div>
    </Link>
  );
}
