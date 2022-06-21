import FollowButton from "components/FollowButton";
import Loader from "components/Loader";
import Sidebar from "components/Sidebar";
import useAuthUser from "context/userContext";
import useVideo from "hooks/useVideo";
import HeartIcon from "icons/HeartIcon";
import db from "lib/firebase";
import { useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { Link, useParams } from "react-router-dom";
import NotFound from "./NotFound";

export default function Profile() {
  const { username } = useParams();
  const [userCol, loading] = useCollection(
    db.collection("users").where("username", "==", username).limit(1)
  );

  const userDoc = userCol?.docs.map((doc) => ({
    id: doc.id,
    ref: doc.ref,
    ...doc.data(),
  }));

  const profile = userDoc?.[0];
  const likedPostsRef = profile?.ref
    .collection("likedPosts")
    .orderBy("timestamp", "desc");
  const [likedPostsCol] = useCollection(likedPostsRef);

  if (!loading && userCol?.empty) return <NotFound />;
  if (loading) return <Loader />;

  return (
    <div className="p-container">
      <Sidebar />
      <div className="p-wrapper">
        <div className="p-inner">
          <ProfileHeader profile={profile} likedPostsCol={likedPostsCol} />
          <ProfileTabs profile={profile} likedPostsCol={likedPostsCol} />
        </div>
      </div>
    </div>
  );
}

function ProfileHeader({ profile, likedPostsCol }) {
  const [user] = useAuthUser()
  
  const followersRef = profile.ref.collection("followers");
  const [followersCol] = useCollection(followersRef);

  const followingRef = profile.ref.collection("following");
  const [followingCol] = useCollection(followingRef);

  return (
    <header className="p-header-container">
      <div className="p-header-wrapper">
        <div className="p-header-avatar-container">
          <img
            src={profile.photoURL}
            alt={profile.username}
            className="p-header-avatar"
          />
        </div>
        <div className="p-header-user-info">
          <h2 className="p-header-username">{profile.username}</h2>
          <h1 className="p-header-displayName">{profile.displayName}</h1>
          <div className="p-header-follow-container">
            <div className="p-header-follow-wrapper">
              {user.username !== profile.username && <FollowButton post={{ user: profile }} />}
            </div>
          </div>
        </div>
      </div>
      <section className="p-header-user-data">
        <div className="p-header-data-column">
          <strong>{followingCol?.size}</strong>
          <span className="p-header-data-title">Following</span>
        </div>
        <div className="p-header-data-column">
          <strong>{followersCol?.size}</strong>
          <span className="p-header-data-title">Followers</span>
        </div>
        <div className="p-header-data-column">
          <strong>{likedPostsCol?.size}</strong>
          <span className="p-header-data-title">Likes</span>
        </div>
      </section>
    </header>
  );
}

function ProfileTabs({ profile, likedPostsCol }) {
  const [isVideosActive, setVideosActive] = useState(true);

  const postsRef = profile.ref.collection("posts").orderBy("timestamp", "desc");
  const [postsCol] = useCollection(postsRef);

  const posts = postsCol?.docs.map((doc) => ({
    id: doc.id,
    ref: doc.ref,
    ...doc.data(),
  }));

  const likedPosts = likedPostsCol?.docs.map((doc) => ({
    id: doc.id,
    ref: doc.ref,
    ...doc.data(),
  }));

  const videoPosts = isVideosActive ? posts : likedPosts;

  return (
    <div className="p-tabs-container">
      <div className="p-tabs-wrapper">
        <p
          onClick={() => setVideosActive(true)}
          className={`p-tabs-videos-tab ${isVideosActive ? "active" : ""}`}>
          <span className="p-tabs-videos-title">Videos</span>
        </p>
        <p
          onClick={() => setVideosActive(false)}
          className={`p-tabs-liked-tab ${!isVideosActive ? "active" : ""}`}>
          <span className="p-tabs-liked-title">Liked</span>
        </p>
        <div
          className="p-tabs-bottom-line"
          style={{
            transform: isVideosActive ? "translateX(0px)" : "translateX(297px)",
          }}
        />
      </div>
      <div className="p-tabs-posts-container">
        {videoPosts?.map((post) => (
          <ProfileVideoPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

function ProfileVideoPost({ post }) {
  const { togglePlay, videoRef } = useVideo();

  return (
    <div className="p-video-post-container">
      <div className="p-video-post-wrapper">
        <div className="p-video-post-ratio">
          <div className="p-video-post-inner">
            <Link onMouseEnter={togglePlay} onMouseLeave={togglePlay} to={`/${post.user.username}/video/${post.postId}`} className="p-video-post-link">
              <div className="p-video-post-card-container">
                <div className="p-video-post-card">
                  <video src={post.videoUrl} muted loop={true} ref={videoRef} className="p-video-post-player"></video>
                  <div className="p-video-post-mask">
                    <div className="p-video-post-footer">
                      <div className="p-video-post-like-container">
                        <HeartIcon />
                        <strong className="p-video-post-like-count">
                          {post.likeCount}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
