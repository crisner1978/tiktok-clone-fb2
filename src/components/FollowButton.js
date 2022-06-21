import useAuthUser from "context/userContext";
import { useDocument } from "react-firebase-hooks/firestore";

export default function FollowButton({ post }) {
  const [user] = useAuthUser()
  
  const followingRef = user?.ref.collection('following').doc(post.user.uid)
  const followerRef = post.ref?.collection("followers").doc(user.uid)
  const [followingDoc] = useDocument(followingRef)

  function addFollow() {
    followingRef?.set(post.user)
    followerRef?.set(user)
  }

  function removeFollow() {
    followingRef?.delete(post.user)
    followerRef?.delete(user)
  }

  return (
    <div className="fb-container">
      <div className="fb-wrapper">
        {followingDoc?.exists ? (
          <button className="ufb" onClick={removeFollow}>Unfollow</button>
        ) : (
          <button className="fb" onClick={addFollow}>Follow</button>
        )
        }
      </div>
    </div>
  );
}
