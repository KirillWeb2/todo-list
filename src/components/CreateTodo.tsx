import React from "react";
import { CreateForm } from "./CreateForm";
import Modal from "./Modal";

interface Props {}

export const CreateTodo: React.FC<Props> = ({}) => {
  const [isModal, setIsModal] = React.useState(false);

  const updateModalState = () => setIsModal((prev) => !prev);

  return (
    <div className="my-[10px]">
      <button onClick={updateModalState} className="btn-green">
        Новая задача
      </button>
      <Modal canShow={isModal} updateModalState={updateModalState}>
        <CreateForm />
      </Modal>
    </div>
  );
};
