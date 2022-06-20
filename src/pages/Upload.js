import DiscardModal from "components/DiscardModal";
import DraftEditor from "components/DraftEditor";
import SuccessModal from "components/SuccessModal";
import useDiscardModal from "context/discardModalContext";
import useSuccessModal from "context/successModalContext";
import useAuthUser from "context/userContext";
import { EditorState } from "draft-js";
import useDragDrop from "hooks/useDragDrop";
import useFirebaseUpload from "hooks/useFirebaseUpload";
import UploadCircleIcon from "icons/UploadCircleIcon";
import db, { serverTimestamp } from "lib/firebase";
import { useState } from "react";
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom";
import shortid from "shortid";

export default function Upload() {
  const [user] = useAuthUser();
  const {
    cancelUpload,
    discardUpload,
    handleUpload,
    file,
    isUploading,
    uploadProgress,
    videoUrl,
  } = useFirebaseUpload(user);

  return (
    <div className="u-container">
      <div className="u-wrapper">
        <div className="u-inner">
          <div className="u-title">
            Upload video
            <div className="u-subtitle">
              This video will be published to {user?.username}
            </div>
          </div>

          <div className="u-content">
            {videoUrl && <UploadPreview file={file} videoUrl={videoUrl} />}
            {isUploading && (
              <UploadProgress
                cancelUpload={cancelUpload}
                file={file}
                uploadProgress={uploadProgress}
              />
            )}
            <UploadSelectFile
              isUploading={isUploading}
              videoUrl={videoUrl}
              handleUpload={handleUpload}
            />
            <UploadForm
              discardUpload={discardUpload}
              user={user}
              videoUrl={videoUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 4 Sub Components of Upload
function UploadPreview({ file, videoUrl }) {
  const { openDiscard } = useDiscardModal();
  return (
    <div className="u-preview-container">
      <div className="u-preview-wrapper">
        <button onClick={openDiscard} className="u-preview-delete-button">
          <img
            src="/delete.svg"
            alt="Delete"
            className="u-preview-delete-icon"
          />
        </button>
        <video
          src={videoUrl}
          autoPlay
          loop
          muted
          className="u-preview-video"></video>
      </div>
      <div className="u-preview-file-size">
        {Math.round(file.size / 1000000)} MB
      </div>
    </div>
  );
}

function UploadProgress({ cancelUpload, file, uploadProgress }) {
  return (
    <div className="u-progress-container">
      <div className="u-progress-circle-container">
        <div className="u-progress-circle">
          <UploadCircleIcon progress={uploadProgress} />
          <img
            onClick={cancelUpload}
            src="/close.svg"
            alt="Close"
            className="u-progress-close-icon"
            style={{ marginTop: -27 }}
          />
          <div className="u-progress-percentage">{uploadProgress}%</div>
          <div className="u-progress-file-name-container">
            <span className="u-progress-file-name">{file.name}</span>
          </div>
        </div>
        <div className="u-progress-file-size">
          {Math.round(file.size / 1000000)} MB
        </div>
      </div>
    </div>
  );
}

function UploadSelectFile({ handleUpload, isUploading, videoUrl }) {
  const { dropRef, inputRef, onSelectFile, selectFile } =
    useDragDrop(getVideoDuration);

  function getVideoDuration(file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const media = new Audio(reader.result);
      media.onloadedmetadata = () => {
        const duration = Math.round(media.duration);
        // over 3 minutes toast notification
        if (duration > 180) {
          toast.error("Video is over the 3-minute limit", {
            style: {
              fontFamily: "proxima-regular",
              borderRadius: 10,
              background: "#333",
              color: "#fff",
            },
          });
        } else {
          // handle the file upload
          handleUpload(file);
        }
      };
    };
    reader.readAsDataURL(file);
  }
  return (
    <div
      ref={dropRef}
      onClick={selectFile}
      className={`${
        isUploading || videoUrl ? "empty" : "u-select-file-container"
      }`}>
      <div className="u-select-file-wrapper">
        <img
          src="/cloud-icon.svg"
          alt="Cloud icon"
          className="u-select-file-icon"
        />
        <div className="u-select-file-title">Select video to upload</div>
        <div className="u-select-file-subtitle">Or drag and drop a file</div>
        <br className="u-select-file-spacer" />
        <ul className="u-select-file-specs">
          <li className="u-select-file-type">MP4 or WebM</li>
          <li className="u-select-file-dimensions">
            720x1280 resolution or higher
          </li>
          <li>Up to 180 seconds</li>
        </ul>
      </div>
      <input
        ref={inputRef}
        onChange={onSelectFile}
        type="file"
        id="file-input"
        accept="video/mp4, video/webm"
        className="u-select-file-input"
      />
    </div>
  );
}

function UploadForm({ discardUpload, user, videoUrl }) {
  const history = useHistory();
  const { closeDiscard, openDiscard } = useDiscardModal();
  const { closeSuccess, openSuccess } = useSuccessModal();
  const [isSubmitting, setSubmitting] = useState(false);

  const [caption, setCaption] = useState({ raw: null, characterLength: 0 });
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  function discardPost() {
    discardUpload();
    closeDiscard();
    closeSuccess();
    setCaption({ raw: null, characterLength: 0 })
    setEditorState(() => EditorState.createEmpty())
  }

  async function onSubmit() {
    if (videoUrl) {
      setSubmitting(true);
      const postId = shortid();
      const userPostRef = db
        .collection("users")
        .doc(user.uid)
        .collection("posts")
        .doc(postId);
      userPostRef
        .set({
          postId,
          user,
          videoUrl,
          likeCount: 0,
          audio_name: `original sound - ${user.username}`,
          caption: caption.raw,
          timestamp: serverTimestamp,
        })
        .then(() => {
          openSuccess();
        })
        .catch((error) => {
          alert("Post could not be added!", error.message);
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
  }

  return (
    <>
      <SuccessModal
        onConfirm={discardPost}
        onCancel={() => history.push(`/${user.username}`)}
      />
      <DiscardModal onConfirm={discardPost} />
      <div className="u-form-container">
        <div className="u-form-wrapper">
          <div className="u-form-inner">
            <div className="u-form-header">
              <span className="u-form-title">Caption</span>
              <span className="u-form-length-container">
                <span className="u-form-length">
                  {caption.characterLength} / 150
                </span>
              </span>
            </div>
            <div className="u-form-input">
              <DraftEditor
                editorState={editorState}
                setEditorState={setEditorState}
                onInputChange={setCaption}
                maxLength={150}
              />
            </div>
          </div>
        </div>
        <div className="u-form-action">
          <button onClick={openDiscard} className="u-form-discard">
            Discard
          </button>
          <button
            disabled={!videoUrl || isSubmitting}
            onClick={onSubmit}
            className="u-form-submit">
            Post
          </button>
        </div>
      </div>
    </>
  );
}
