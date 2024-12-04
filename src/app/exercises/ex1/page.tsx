import React from "react";
import Pose1 from "../../poses/pose1/page";
import Link from "next/link";

const Ex1: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-semibold text-gray-800 mt-4 mb-4">
        Welcome to exercise 1. Press the button once you are done with the pose
      </h2>
      <div className="flex justify-center mt-4">
        <Link href="/exercises/ex1-2" passHref legacyBehavior>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg">
            Go to next pose
          </button>
        </Link>
      </div>
      <div className="mt-8">
        <Pose1 />
      </div>
      <div className="flex justify-center mt-8">
        <Link href="/exercises" passHref legacyBehavior>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg">
            Go to Exercises
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Ex1;
