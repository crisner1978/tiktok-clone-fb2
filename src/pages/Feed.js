import FeedItem from "components/FeedItem";
import Sidebar from "components/Sidebar";
import db from "lib/firebase";
import { useCollection } from "react-firebase-hooks/firestore";

export default function Feed() {
  return (
    <div className="feed-container">
      <Sidebar />
      <FeedList />
    </div>
  );
}

function FeedList() {
  const [postsCol] = useCollection(db.collectionGroup("posts"))

  const posts = postsCol?.docs.map(doc => ({
    id: doc.id,
    ref: doc.ref,
    ...doc.data()
  }))

  return (
    <div className="feed-item-container">
      <div className="feed-item-inner">
        {posts?.map((post) => (
          <FeedItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
