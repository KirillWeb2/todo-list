import React, { FC } from "react";

interface ModalProps {
  canShow: boolean;
  updateModalState: () => void;
  children: React.ReactNode
}

const Modal: FC<ModalProps> = ({ canShow, updateModalState, children }) => {
  if (canShow) {
    return (
      <div onClick={updateModalState} className={"modal"}>
        <div onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    );
  }
  return null;
};

export default Modal;
