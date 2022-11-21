import React from "react";

import { ITodo } from "../interface/todo";
import { ChangeForm } from "./ChangeForm";
import { CreateTodo } from "./CreateTodo";
import Modal from "./Modal";
import { Todo } from "./Todo";

interface Props {
  todos: ITodo[];
}

export const TodoList: React.FC<Props> = ({ todos }) => {
  const [isModal, setIsModal] = React.useState<boolean>(false);
  const [currentChangeTodo, setCurrentChangeTodo] = React.useState<ITodo>(
    {} as ITodo
  );

  const updateModalState = () => setIsModal((prev) => !prev);

  /**
   * Помещает выбранный элемент в состояние currentChangeTodo и открывает модалку
   * @constructor
   * @param {ITodo} todo - элемент'
   */
  const getIdCurrentElement = (todo: ITodo) => {
    updateModalState();
    setCurrentChangeTodo(todo);
  };

  if (!Array.isArray(todos))
    return <p className="text-3xl text-white font-semibold">Loading...</p>;

  return (
    <div className="flex flex-col gap-[5px]">
      <CreateTodo />
      {todos.map((i) => (
        <Todo key={i.id} item={i} getIdCurrentElement={getIdCurrentElement} />
      ))}
      <Modal canShow={isModal} updateModalState={updateModalState}>
        <ChangeForm currentChangeTodo={currentChangeTodo} />
      </Modal>
    </div>
  );
};
