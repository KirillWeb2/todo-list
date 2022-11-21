export type Collections = "todos";

export interface ITodo {
  id: string
  date_end: string;
  description: string;
  files: string[];
  title: string;
}

export interface INewTodo {
  date_end: string;
  description: string;
  files: FileList | null;
  title: string;
}

export interface ICreateTodo {
  date_end: string;
  description: string;
  files: string[];
  title: string;
}
