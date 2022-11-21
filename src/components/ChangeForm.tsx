import React from "react";

import cross from "../assets/img/cross.png";
import { INewTodo, ITodo } from "../interface/todo";
import {
  deleteImageFromStorage,
  downloadFile,
  isValid,
  updateTodoInCollection,
} from "../utils/todo";

interface Props {
  currentChangeTodo: ITodo;
}

export const ChangeForm: React.FC<Props> = ({ currentChangeTodo }) => {
  const filesInput = React.useRef<HTMLInputElement>(null);

  const [form, setForm] = React.useState<INewTodo>({
    date_end: currentChangeTodo.date_end,
    description: currentChangeTodo.description,
    files: null,
    title: currentChangeTodo.title,
  });

  const [pictureList, setPictureList] = React.useState<string[]>(
    currentChangeTodo.files
  );

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const change = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "title":
        setForm({ ...form, title: e.target.value });
        break;
      case "description":
        setForm({ ...form, description: e.target.value });
        break;
      case "date_end":
        setForm({ ...form, date_end: e.target.value.split("T").join(" ") });
        break;
      case "files":
        addFilesForTodo(e.target.files);
        setForm({ ...form, files: e.target.files });
        break;
      default:
        console.log("change create todo form error");
    }
  };

  /**
   * Удаление картинки. PictureList - это массив картинок, для быстрого удаления картинки с экрана пользотваеля, я фильтрую
   * массив картинок, сохраняю этот массив и дальше вызываю функцию удаления изображения и функцию обновления данных у элемента ().
   * @constructor
   * @param {string} fileName - url картинки
   */
  const deleteImage = (fileName: string) => {
    setIsLoading(true);

    const newArrayPicture = pictureList.filter((i) => i !== fileName);

    setPictureList(newArrayPicture);

    deleteImageFromStorage(fileName);

    updateTodoInCollection("todos", currentChangeTodo.id, {
      ...currentChangeTodo,
      files: newArrayPicture,
    });

    setIsLoading(false);
  };

  /**
   * Сразу сохраняю новые файлу в базу и сохраняю их url, дальше получаю массив изображений старых и "новых" путём конкатенации.
   * Сохраняю этот массив локально в state и изменяю у элемент в коллекции массив картинок (меняю его на новый).
   * Обнуляю input[file]
   * @constructor
   * @param {FileList | null} files - файлы
   */
  const addFilesForTodo = async (files: FileList | null) => {
    setIsLoading(true);

    const list_url: string[] = [];

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const url = await downloadFile(files[i]);
        list_url.push(url!);
      }
    }

    const newArrayPicture = [...pictureList, ...list_url];

    setPictureList(newArrayPicture);

    updateTodoInCollection("todos", currentChangeTodo.id, {
      ...currentChangeTodo,
      files: newArrayPicture,
    });

    if (filesInput.current) filesInput.current.value = "";

    setIsLoading(false);
  };

  /**
   * Отправляю изменения на сервер
   */
  const updateTodo = () => {
    setIsLoading(true);

    if (!isValid<INewTodo>(form)) {
      setIsLoading(false);
      return alert("Заполните все поля");
    }

    updateTodoInCollection("todos", currentChangeTodo.id, {
      ...currentChangeTodo,
      title: form.title,
      description: form.description,
      date_end: form.date_end.split("T").join(" "),
      files: pictureList,
    });

    setIsLoading(false);
  };

  return (
    <div className="bg-white p-[20px] rounded-[10px] min-w-[400px] w-[90%] flex flex-col gap-[10px]">
      <div className="flex justify-center items-center font-semibold text-xl">
        Изменение задачи
      </div>
      <div className="flex flex-col gap-[12px]">
        <input
          name="title"
          value={form.title}
          onChange={change}
          type="text"
          placeholder="Заголовок"
        />
        <input
          name="description"
          value={form.description}
          onChange={change}
          type="text"
          placeholder="Описание"
        />
        <input
          name="date_end"
          value={form.date_end}
          onChange={change}
          type="datetime-local"
        />
        <input
          ref={filesInput}
          name="files"
          onChange={change}
          type="file"
          multiple
        />
      </div>
      <div className="flex gap-[6px] my-[10px]">
        {pictureList.map((i, index) => (
          <div key={index} className="relative">
            <img className="w-[120px]" src={i} alt="" />
            <img
              src={cross}
              onClick={() => deleteImage(i)}
              className="absolute right-[6px] top-[6px] w-[16px] h-[16px] cursor-pointer"
              alt=""
            />
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center mt-[20px]">
        <button onClick={updateTodo} disabled={isLoading} className="btn-green">
          Изменить
        </button>
      </div>
    </div>
  );
};
