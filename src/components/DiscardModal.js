import useDiscardModal from "context/discardModalContext";
import Modal from "./Modal";

export default function DiscardModal({ onConfirm }) {
  const {isDiscardOpen, closeDiscard} = useDiscardModal()
  return (
    <Modal open={isDiscardOpen} onClose={closeDiscard}>
      <div className="discard-modal-container">
        <div className="discard-modal-title-container">
          <h3 className="discard-modal-title">Discard this post?</h3>
          <p className="discard-modal-subtitle">
            Thie video and all edits will be discarded
          </p>
        </div>
        <button onClick={onConfirm} className="discard-modal-confirm">Discard</button>
        <button onClick={closeDiscard} className="discard-modal-discard">Continue editing</button>
      </div>
    </Modal>
  );
}
