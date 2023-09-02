import React from "react";

const useTitle = (title: string) => {
  React.useEffect(() => {
    document.title = `Kong | ${title}`;
  }, [title]);
};

export default useTitle;
