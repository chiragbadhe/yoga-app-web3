import Link from "next/link";
import React from "react";
import Image from "next/image";

const Exercises = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold underline">Exercises</h1>
      <p className="mt-4">Get all the exercises available and show them all</p>
      <div className="mt-8">
        <h3 className="text-lg font-semibold">Exercise Set 1</h3>
        <p>It contains the following poses</p>
        <div className="flex justify-between mt-4">
          <Image
            src="/pose1.png"
            alt="Pose 1"
            height={200}
            width={200}
            objectFit="cover"
          />
          <Image
            src="/pose2.png"
            alt="Pose 2"
            height={200}
            width={200}
            objectFit="cover"
          />
        </div>
        <Link href="/exercises/ex1" legacyBehavior>
          <button className="mt-4 p-4 bg-white rounded-lg shadow-lg text-center">
            Go to Exercise 1
          </button>
        </Link>
      </div>
      <div className="mt-8">
        <Link href="/" legacyBehavior>
          <button className="p-4 bg-white rounded-lg shadow-lg text-center">
            Back to home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Exercises;
