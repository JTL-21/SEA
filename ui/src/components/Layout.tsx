import React from "react";
import TopBar from "./TopBar";

interface Props {
  children?: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <TopBar />
      <div className="mx-auto h-full p-2 pb-0 pt-14 text-gray-900">
        {children}
      </div>
    </>
  );
};

export default Layout;
