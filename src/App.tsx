import React from "react";
import { TodoList } from "./components/TodoList";
import { Wrapper } from "./components/Wrapper";
import { db, postConverter } from "./firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";

export const App: React.FC = () => {
  const ref = collection(db, "todos").withConverter(postConverter);
  const [snapshot, loading] = useCollectionData(ref);

  if (loading || !snapshot)
    return (
      <h1 className="text-3xl font-semibold absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        Loading...
      </h1>
    );

  return (
    <>
      <Wrapper>
        <TodoList todos={snapshot} />
      </Wrapper>
    </>
  );
};
