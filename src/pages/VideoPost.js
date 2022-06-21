import DraftEditor from "components/DraftEditor";
import FollowButton from "components/FollowButton";
import LikeButton from "components/LikeButton";
import Loader from "components/Loader";
import MessagesButton from "components/MessagesButton";
import MyPostTag from "components/MyPostTag";
import useAuthUser from "context/userContext";
import { EditorState } from "draft-js";
import useVideo from "hooks/useVideo";
import CloseIcon from "icons/CloseIcon";
import MusicIcon from "icons/MusicIcon";
import VolumeIcon from "icons/VolumeIcon";
import VolumeOffIcon from "icons/VolumeOffIcon";
import { formatDraftText } from "lib/draft-utils";
import db, { serverTimestamp } from "lib/firebase";
import { useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { Link, useHistory, useParams } from "react-router-dom";

export default function VideoPost() {
  const { postId } = useParams();

  const [postsCol, loading] = useCollection(
    db.collectionGroup("posts").where("postId", "==", postId).limit(1)
  );

  const postDoc = postsCol?.docs.map((doc) => ({
    id: doc.id,
    ref: doc.ref,
    ...doc.data(),
  }));

  const post = postDoc?.[0];

  if (loading) return <Loader />;

  return (
    <div className="vp-container">
      <VideoPostPlayer post={post} />
      <div className="vp-container-right">
        <VideoPostInfo post={post} />
        <VideoPostComments post={post} />
        <VideoPostCommentForm post={post} />
      </div>
    </div>
  );
}

function VideoPostPlayer({ post }) {
  const history = useHistory();
  const { videoRef, isMuted, toggleMute } = useVideo();
  return (
    <div className="vp-player-container">
      <div className="vp-player-wrapper">
        <video
          ref={videoRef}
          src={post?.videoUrl}
          muted={isMuted}
          autoPlay
          loop={true}
          className="vp-player"></video>
      </div>
      <CloseIcon onClick={history.goBack} />
      {isMuted ? (
        <VolumeOffIcon onClick={toggleMute} />
      ) : (
        <VolumeIcon onClick={toggleMute} />
      )}
    </div>
  );
}

function VideoPostInfo({ post }) {
  const [user] = useAuthUser()

  function datePosted() {
    const date = new Date(post.timestamp.toDate().toString());
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}-${day}`;
  }

  console.log("caption",formatDraftText(post.caption))

  return (
    <>
      <div className="vp-info-container">
        <div className="vp-info-wrapper">
          <Link to={`/${post.user.username}`} className="vp-info-avatar-link">
            <img
              src={post.user.photoURL}
              alt={post.user.username}
              className="vp-info-avatar"
            />
          </Link>
          <div className="vp-info-user">
            <Link to={`/${post.user.username}`}>
              <h2 className="vp-info-username">{post.user.username}</h2>
            </Link>
            <Link to={`/${post.user.username}`}>
              <h2 className="vp-info-displayName">
                {post.user.displayName}
                <span className="vp-info-divider"> · </span>
                {datePosted()}
              </h2>
            </Link>
          </div>
          {user.username !== post.user.username ? <FollowButton post={post} /> : <MyPostTag />}
        </div>
      </div>
      <div className="vp-info-caption-container">
        <h1
          className="vp-info-caption"
          dangerouslySetInnerHTML={{ __html: formatDraftText(post.caption) }}
        />
        <h2 className="vp-info-music">
          <MusicIcon />
          {post.audio_name}
        </h2>
        <div className="vp-info-action-container">
          <div className="vp-info-action-wrapper">
            <div className="vp-info-action">
              <LikeButton post={post} />
            </div>
            <div className="vp-info-action">
              <MessagesButton post={post} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function VideoPostComments({ post }) {
  const [commentsCol] = useCollection(post.ref.collection("comments"));
  const comments = commentsCol?.docs.map((doc) => ({
    id: doc.id,
    ref: doc.ref,
    ...doc.data(),
  }));
  return (
    <div className="vp-comments-container">
      <div className="vp-comments">
        {comments?.map((comment) => (
          <VideoPostComment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}

function VideoPostComment({ comment }) {
  return (
    <div className="vp-comment-container">
      <div className="vp-comment-wrapper">
        <Link to={`/${comment.user.username}`} className="vp-comment-link">
          <img
            src={comment.user.photoURL}
            alt={comment.user.username}
            className="vp-comment-avatar"
          />
        </Link>
        <div className="vp-comment-content">
          <Link to={`${comment.user.username}`} className="vp-comment-link">
            <span className="vp-comment-username">{comment.user.username}</span>
          </Link>
          <p className="vp-comment-text-container">
            <span
              className="vp-comment-text"
              dangerouslySetInnerHTML={{
                __html: formatDraftText(comment.text),
              }}
            />
          </p>
        </div>
      </div>
    </div>
  );
}

function VideoPostCommentForm({ post }) {
  const [user] = useAuthUser();
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [comment, setComment] = useState({ raw: null, characterLength: 0 });

  function addComment() {
    const newComment = {
      text: comment.raw,
      user,
      createdAt: serverTimestamp,
    };
    post.ref.collection("comments").add(newComment);
    setEditorState(EditorState.createEmpty());
  }
  return (
    <div className="vp-comment-form-container">
      <div className="vp-comment-form-wrapper">
        <DraftEditor
          editorState={editorState}
          setEditorState={setEditorState}
          onInputChange={setComment}
          maxLength={150}
        />
        <button onClick={addComment} className="vp-comment-form-submit">
          Post
        </button>
      </div>
    </div>
  );
}
