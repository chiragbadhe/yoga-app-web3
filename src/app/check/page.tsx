"use client";

import React, { useEffect } from "react";
import { initializeBackend } from "@/utils/initTensorflow";

const TensorflowComponent = () => {
  useEffect(() => {
    const setupTensorflow = async () => {
      try {
        await initializeBackend();
        console.log("TensorFlow.js initialized");
      } catch (error) {
        console.error("Error initializing TensorFlow.js:", error);
      }
    };

    setupTensorflow();
  }, []);

  return (
    <div>
      <h1>TensorFlow.js in Next.js</h1>
    </div>
  );
};

export default TensorflowComponent;
