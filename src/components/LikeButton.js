import useAuthUser from "context/userContext";
import GrayLikeIcon from "icons/GrayLikeIcon";
import RedLikeIcon from "icons/RedLikeIcon";
import { increment } from "lib/firebase";
import { useDocument } from "react-firebase-hooks/firestore";

export default function LikeButton({ post }) {
  const [user] = useAuthUser()
  const likeRef = post.ref.collection("likes").doc(user.uid)
  const [likeDoc] = useDocument(likeRef)
  const likedPostsRef = user.ref.collection('likedPosts').doc(post.id)

    function addLike() {
      post.ref.update({ likeCount: increment(1)})
      likeRef.set({ uid: user.uid })
      likedPostsRef.set(post)
    }

    function removeLike() {
      post.ref.update({ likeCount: increment(-1)})
      likeRef.delete({ uid: user.uid })
      likedPostsRef.delete(post)
    }

  return (
    <button className="like-button">
      {likeDoc?.exists ? (
        <RedLikeIcon onClick={removeLike} />
      ) : (
        <GrayLikeIcon onClick={addLike} />
      )}
      <strong className="like-button-count">{post.likeCount}</strong>
    </button>
  );
}
