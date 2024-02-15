import React from "react";
import Loading from "./Loading";

export const LoadingDialog = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50" style={{
        zIndex: 1000
    }}>
      <div className="bg-white p-4 rounded-md">
        <p className="text-lg font-semibold">
            <Loading />
        </p>
      </div>
    </div>
  );
};
