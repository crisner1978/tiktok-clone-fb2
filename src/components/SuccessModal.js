import Modal from "./Modal";
import useSuccessModal from 'context/successModalContext'

export default function SuccessModal({ onConfirm, onCancel }) {
  const { isSuccessOpen, closeSuccess } = useSuccessModal()
  return (
    <Modal open={isSuccessOpen} onClose={closeSuccess}>
      <div className="success-modal-container">
        <div className="success-modal-title-container">
          <h3 className="success-modal-title">Your video is being</h3>
          <p className="success-modal-subtitle">uploaded to Tiktok</p>
        </div>
        <button onClick={onConfirm} className="success-modal-discard">Upload another video</button>
        <button onClick={onCancel} className="success-modal-confirm">View profile</button>
      </div>
    </Modal>
  );
}
