import dayjs from "dayjs";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";

import { db } from "../firebase";
import { Collections, ICreateTodo, ITodo } from "../interface/todo";

/**
 * Добавление элемента в коллекцию элементов
 * @constructor
 * @param {ICreateTodo} element - элемент
 * @param {Collections} collectionName - имя коллекции
 */
export const addItemInCollection = async (
  element: ICreateTodo,
  collectionName: Collections
): Promise<void> => {
  const citiesRef = collection(db, collectionName);

  await setDoc(doc(citiesRef), element);
};

/**
 * Отправляет изображение в Firebase storage и возвращает ссылку на это изображение
 * @constructor
 * @param {ICreateTodo} file - файл
 */
export const downloadFile = async (file: File): Promise<null | string> => {
  const storage = getStorage();
  const storageRef = ref(storage, file.name + "_" + new Date().getTime());

  if (file) {
    return uploadBytes(storageRef, file).then(async (snapshot) => {
      return await getDownloadURL(snapshot.metadata.ref!);
    });
  }

  return null;
};

/**
 * Обновляет данные у элемента в коллекции
 * @constructor
 * @param {Collections} collectionName - имя коллекции
 * @param {string} elementId - id (key) элемента
 * @param {ITodo} changedElement - элемент с изменениями
 */
export const updateTodoInCollection = async (
  collectionName: Collections,
  elementId: string,
  changedElement: ITodo
) => {
  const cityRef = doc(db, collectionName, elementId);
  await updateDoc(cityRef, {
    title: changedElement.title,
    description: changedElement.description,
    files: changedElement.files,
    date_end: changedElement.date_end,
  });
};

/**
 * удаление элемента из коллекции
 * @constructor
 * @param {Collections} collectionName - имя коллекции
 * @param {string} elementId - id (key) элемента
 */
export const deleteItemFromCollection = async (
  collectionName: Collections,
  elementId: string
) => {
  await deleteDoc(doc(db, collectionName, elementId)); // ok!
};

/**
 * удаление изображения по его fileName (по сути это url)
 * @constructor
 * @param {string} fileName - имя коллекции
 */
export const deleteImageFromStorage = async (fileName: string) => {
  const storage = getStorage();

  const desertRef = ref(storage, fileName);

  await deleteObject(desertRef);
};

/**
 * Функция сравнивает кол-ва миллисекунд у назначенной даты таски и времени пользователя в данный момент. Проще говоря, если
 * кол-во миллисекунд у таски меньше, чем у пользователя в данный момент, значите время таски истекло
 * @constructor
 * @param {string} date - имя коллекции
 */
export const checkingTheRelevance = (date: string): boolean => {
  const taskEndTime = dayjs(date).toDate().getTime() / 1000;
  const myTime = new Date().getTime() / 1000;
  return taskEndTime < myTime ? false : true;
};

/**
 * Проверяет, чтобы все поля в объекте были заполнены. Кроме файлов и описания (Они не обязательны).
 * @constructor
 * @param {any} obj - имя коллекции
 */
export const isValid = <T>(obj: T): boolean => {
  let result = true;
  for (let i in obj) {
    if (!obj[i] && i !== "files" && i !== "description") result = false;
  }

  return result;
};
