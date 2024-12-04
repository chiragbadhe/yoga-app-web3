import React from "react";
import Link from "next/link";
import Processor from "../../../components/Processor";

const Pose2: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold">Pose 2</h1>
      <p className="mt-2">Try out Pose 2</p>
      <div className="flex justify-center items-center mt-4">
        <Processor poseNo="pose2" />
        <img src={"/pose4.png"} className="w-75 h-75 ml-4" />
      </div>
      <h2 className="mt-8">
        <Link href="/poses" legacyBehavior>
          <a className="p-4 bg-white rounded-lg shadow-lg text-center">
            Back to poses
          </a>
        </Link>
      </h2>
    </div>
  );
};

export default Pose2;
