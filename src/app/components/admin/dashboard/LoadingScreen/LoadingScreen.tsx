import React from "react";
import { Spin } from "antd";

const LoadingScreen = () => {
    return (
        <div className="min-h-screen bg-gray-100 bg-opacity-75 flex items-center justify-center  translate-y-[-15%]">
            <div className="flex flex-col items-center">
                <Spin size="large" />
            </div>
        </div>
    );
};

export default LoadingScreen;