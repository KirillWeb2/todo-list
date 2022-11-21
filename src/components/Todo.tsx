import React from "react";

import array from "../assets/img/down-arrow.png";
import { ITodo } from "../interface/todo";
import {
  checkingTheRelevance,
  deleteImageFromStorage,
  deleteItemFromCollection,
} from "../utils/todo";

interface Props {
  item: ITodo;
  getIdCurrentElement: (id: ITodo) => void;
}

export const Todo: React.FC<Props> = React.memo(
  ({ item, getIdCurrentElement }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const { date_end, description, files, id, title } = item;

    const isRelevant = checkingTheRelevance(date_end);

    const deleteTodo = async (elementId: string, files: string[]) => {
      await deleteItemFromCollection("todos", elementId);
      Promise.all(files.map((i) => deleteImageFromStorage(i)));
    };

    return (
      <div className="flex flex-col w-100% bg-white py-[3px] px-[10px]">
        <div className="px-[8px] mt-[6px] text-green-600 font-semibold">
          {isRelevant ? (
            <p className="text-green-600">Задача ещё актуальна</p>
          ) : (
            <p className="text-red-600">Задача не актуальна</p>
          )}
        </div>
        <div className="px-[8px] mb-[6px] flex justify-between items-center">
          <p className="text-2xl font-semibold">{title}</p>
          <img
            src={array}
            className={`w-[40px] h-[40px] cursor-pointer ${
              isExpanded ? "rotate-0" : "rotate-90"
            }`}
            onClick={() => setIsExpanded(!isExpanded)}
            alt=""
          />
        </div>

        {isExpanded && (
          <div className="flex flex-col gap-[8px] p-[10px]">
            <div>
              <p>{description}</p>
              <div className="flex flex-wrap gap-[4px] my-[10px]">
                {files.map((i) => (
                  <img key={i} className="w-[120px] h-[auto]" src={i} alt="" />
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Сделать до: {date_end}</p>
              </div>
              <div className="flex gap-[8px] justify-end">
                <button
                  onClick={() => getIdCurrentElement(item)}
                  className="btn-orange"
                >
                  Изменить
                </button>
                <button
                  onClick={() => deleteTodo(id, files)}
                  className="btn-green"
                >
                  Завершить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);
