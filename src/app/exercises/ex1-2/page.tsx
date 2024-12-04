import React from "react";
import Pose2 from "../../poses/pose2/page";
import Link from "next/link";

const Ex12: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <h2 className="text-lg font-semibold">
        Welcome to exercise 1. Press the button once you are done with the pose
      </h2>
      <Link href="/exercises" legacyBehavior>
        <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Go to next pose
        </a>
      </Link>
      <Pose2 />
      <Link href="/exercises" legacyBehavior>
        <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Go to Exercises
        </a>
      </Link>
    </div>
  );
};

export default Ex12;
