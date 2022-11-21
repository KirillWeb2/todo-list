import React from "react";

interface IProps {
  children: React.ReactNode;
}

export const Wrapper: React.FC<IProps> = ({ children }) => {
  return (
    <div className="w-[100%] h-[100vh] flex justify-center items-center">
      <div className="max-w-[900px] w-[90%] p-[12px] m-[8px] h-[80vh] bg-gray-300 overflow-y-scroll">
        {children}
      </div>
    </div>
  );
};
