import React from "react";
import { INewTodo, ITodo } from "../interface/todo";
import { addItemInCollection, downloadFile, isValid } from "../utils/todo";

interface Props {}

export const CreateForm: React.FC<Props> = ({}) => {
  const filesInput = React.useRef<HTMLInputElement>(null);

  const [form, setForm] = React.useState<INewTodo>({
    date_end: "",
    description: "",
    files: null,
    title: "",
  });
  const [currentImages, setCurrentImages] = React.useState<string[]>([]);
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
        fileReader(e.target.files);
        setForm({ ...form, files: e.target.files });
        break;
      default:
        console.log("change create todo form error");
    }
  };

  /**
   * Получает файлы на вход, читает их и возвращает содержимое файла как data URL, далее это записывается в состояниее currentImages
   * @constructor
   * @param {FileList | null} files - элемент'
   */
  const fileReader = (files: FileList | null) => {
    const images: string[] = [];

    if (files) {
      for (var i = 0; i < files.length; i++) {
        const reader = new FileReader();

        reader.onload = (e) => {
          images.push(e.target?.result as string);
          setCurrentImages(images);
        };

        reader.readAsDataURL(files[i]);
      }
    }
  };

  /**
   * Циклом проходится по массиву файлов (обратите внимание, когда срабатывает onChange у input[file] то, он сохраняет значение
   * в form и запускает функцию fileReader), на каждоый итерации вызывает функцию, которая сохраняет картинку на сервере и возвращает
   * её url, который сохраняется в переменной. Далее вызывается функция добавления элемента в коллекцию. В конце все состояния обнуляются
   * @constructor
   */
  const createTodo = async () => {
    setIsLoading(true);

    if(!isValid<INewTodo>(form)) {
      setIsLoading(false);
      return alert("Заполните все поля")
    }

    const list_url: string[] = [];

    if (form.files) {
      for (let i = 0; i < form.files.length; i++) {
        const url = await downloadFile(form.files[i]);
        list_url.push(url!);
      }
    }

    await addItemInCollection(
      {
        ...form,
        files: list_url,
      },
      "todos"
    );

    if (filesInput.current) filesInput.current.value = "";
    setForm({ date_end: "", description: "", files: null, title: "" });
    setCurrentImages([]);

    setIsLoading(false);
  };

  return (
    <div className="bg-white p-[20px] rounded-[10px] min-w-[400px] w-[90%] flex flex-col gap-[10px]">
      <div className="flex justify-center items-center font-semibold text-xl">
        Создание задачи
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
      <div className="flex flex-wrap gap-[6px] my-[10px]">
        {currentImages.map((i, index) => (
          <img key={index} className="w-[116px]" src={i} alt="" />
        ))}
      </div>
      <div className="flex justify-center items-center mt-[20px]">
        <button onClick={createTodo} disabled={isLoading} className="btn-green">
          Создать
        </button>
      </div>
    </div>
  );
};
