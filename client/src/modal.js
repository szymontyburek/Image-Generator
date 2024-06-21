import { useState, useEffect } from "react";
import Button from "./Button";

function Modal({ clickEvent, ModalContents }) {
  const [sharedModalClass, setSharedModalClass] = useState("modal");
  const [sharedOverlayClass, setSharedOverlayClass] = useState("modal");

  useEffect(() => {
    if (clickEvent.current > 0) openModal(); //clickEvent equals 0 on initial HTML render
  }, [clickEvent.current]);

  function openModal() {
    setSharedModalClass("modal active");
    setSharedOverlayClass("modal active");
  }

  function closeModal() {
    setSharedModalClass("modal");
    setSharedOverlayClass("modal");
  }

  return (
    <div>
      <ModalBodyContainer
        className={sharedModalClass}
        closeModal={closeModal}
        ModalContents={ModalContents}
      />
      <OverlayDiv className={sharedOverlayClass} />
    </div>
  );
}

function ModalBodyContainer({ className, closeModal, ModalContents }) {
  return (
    <div className={className} id="modal">
      <ModalContents closeModal={closeModal} />
    </div>
  );
}

function OverlayDiv({ sharedOverlayClass }) {
  return <div className={sharedOverlayClass} id="overlay"></div>;
}

export default Modal;
