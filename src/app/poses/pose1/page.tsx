import React from "react";
import Link from "next/link";
import Image from "next/image"; // Import Image from next/image
import Processor from "../../../components/PoseProcessor";

const Pose1: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold">Pose 1</h1>
      <p className="mt-2">Try out Pose 1</p>
      <Image
        src="/pose1.png"
        alt="Pose 1 Image"
        layout="fixed"
        width={75}
        height={75}
        className="ml-4"
      />
      <div className="flex justify-center items-center mt-4 bg-red-100">
        <Processor poseNo={"pose1"} />
      </div>
      <h2 className="mt-8">
        <Link href="/poses" legacyBehavior>
          <a className="p-4 bg-white rounded-lg shadow-lg text-center">
            Go to Poses
          </a>
        </Link>
      </h2>
    </div>
  );
};

export default Pose1;
