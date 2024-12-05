"use client";

import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as posenet from "@tensorflow-models/posenet";

import "@tensorflow/tfjs-backend-webgl";

// Existing type definitions remain the same
interface Position {
  x: number;
  y: number;
}

interface Keypoint {
  part: string;
  position: Position;
  score: number;
}

interface Pose {
  keypoints: Keypoint[];
}

interface JointAngles {
  [key: string]: Position | undefined;
}

// Connections and other existing interfaces remain the same
const connections: number[][] = [
  [11, 5], // Left shoulder to left hip
  [7, 5], // Right shoulder to right hip
  [7, 9], // Right shoulder to right elbow
  [11, 13], // Left shoulder to left elbow
  [13, 15], // Left elbow to left wrist
  [12, 6], // Right hip to right knee
  [8, 6], // Left hip to left knee
  [8, 10], // Left knee to left ankle
  [12, 14], // Right knee to right ankle
  [14, 16], // Right ankle to right foot
  [5, 6], // Left hip to right hip
  [11, 12], // Left shoulder to right shoulder
];

// New type for pose validation function
type PoseValidationFunction = (jointAngles: JointAngles) => boolean;

// Pose validation functions
const poseValidations: { [key: string]: PoseValidationFunction } = {
  pose1: (jointAngles: JointAngles) => {
    // Validate pose1 (e.g., arm angles)
    const leftArmAngle = calculateAngle(
      jointAngles.leftShoulder,
      jointAngles.leftElbow,
      jointAngles.leftWrist
    );
    const rightArmAngle = calculateAngle(
      jointAngles.rightShoulder,
      jointAngles.rightElbow,
      jointAngles.rightWrist
    );

    const isLeftArmValid =
      leftArmAngle !== null && leftArmAngle >= 165 && leftArmAngle <= 200;
    const isRightArmValid =
      rightArmAngle !== null && rightArmAngle >= 165 && rightArmAngle <= 200;

    return isLeftArmValid && isRightArmValid;
  },

  pose2: (jointAngles: JointAngles) => {
    // Validate pose2 (e.g., hip and knee angle)
    const hipKneeAngle = calculateAngle(
      jointAngles.rightEye,
      jointAngles.rightHip,
      jointAngles.rightKnee
    );

    return hipKneeAngle !== null && hipKneeAngle <= 40;
  },

  pose3: (jointAngles: JointAngles) => {
    // Validate pose3 (e.g., hip and knee alignment)
    const hipKneeAngle = calculateAngle(
      jointAngles.rightEye,
      jointAngles.rightHip,
      jointAngles.rightKnee
    );

    return hipKneeAngle !== null && hipKneeAngle >= 45;
  },
};

// Helper function to calculate angle between three points
function calculateAngle(
  a?: Position,
  b?: Position,
  c?: Position
): number | null {
  if (!a || !b || !c) {
    console.log("Out of Frame.");
    return null;
  }

  const theta = Math.abs(
    (Math.atan2(a.y - b.y, a.x - b.x) - Math.atan2(c.y - b.y, c.x - b.x)) *
      (180 / Math.PI)
  );

  return theta;
}

interface ProcessorProps {
  poseNo: string;
}

const Processor: React.FC<ProcessorProps> = ({ poseNo }) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [net, setNet] = useState<posenet.PoseNet | null>(null);
  const [isPoseValid, setIsPoseValid] = useState(false);

  // Draw function with updated pose validation
  const draw = (pose: Pose) => {
    const canvas = canvasRef.current;
    const video = webcamRef.current?.video;

    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, 650, 480, 0, 0, 650, 480);

    const points = pose.keypoints;
    const jointAngles: JointAngles = {};

    // Draw keypoints and collect joint angles
    for (let i = 0; i < points.length; i++) {
      const key = points[i];
      if (key.score > 0.2) {
        ctx.beginPath();
        ctx.arc(key.position.x, key.position.y, 2, 0, 2 * Math.PI);
        ctx.fillStyle = "#00FF00";
        ctx.stroke();

        jointAngles[key.part] = key.position;
      }
    }

    // Validate pose using the new modular approach
    const validatePose = poseValidations[poseNo] || poseValidations.pose3;
    const isValid = validatePose(jointAngles);
    setIsPoseValid(isValid);

    // Draw skeleton lines
    for (let i = 0; i < connections.length; i++) {
      const link = connections[i];
      if (points[link[0]].score > 0.2 || points[link[1]].score > 0.2) {
        ctx.moveTo(points[link[0]].position.x, points[link[0]].position.y);
        ctx.lineTo(points[link[1]].position.x, points[link[1]].position.y);
        ctx.lineWidth = 4;
        ctx.strokeStyle = isValid ? "green" : "red";
        ctx.stroke();
      }
    }
  };

  // Existing runPose and useEffect hooks remain the same
  const runPose = async () => {
    if (net && webcamRef.current?.video) {
      const video = webcamRef.current.video;

      if (video.readyState === 4) {
        video.width = video.videoWidth;
        video.height = video.videoHeight;

        const pose = await net.estimateSinglePose(video, {
          flipHorizontal: false,
        });
        draw(pose);
      }
    }
  };

  useEffect(() => {
    const loadPoseNet = async () => {
      try {
        const loadedNet = await posenet.load({
          architecture: "ResNet50",
          outputStride: 32,
          inputResolution: { width: 257, height: 200 },
          quantBytes: 2,
        });
        setNet(loadedNet);
      } catch (error) {
        console.error("Failed to load PoseNet", error);
      }
    };

    loadPoseNet();
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (net) {
      intervalId = setInterval(runPose, 150);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [net, runPose]);

  const videoConstraints = {
    width: 650,
    height: 480,
    facingMode: "user",
  };

  return (
    <div className="relative w-full h-full">
      <Webcam
        audio={false}
        ref={webcamRef}
        videoConstraints={videoConstraints}
        mirrored={false}
        className="w-full h-auto rounded-lg shadow-lg"
      />
      <canvas
        ref={canvasRef}
        id="canvas"
        width="650"
        height="480"
        className="w-full absolute top-0"
      />
      {/* Optional: Add a visual indicator of pose validity */}
      <div
        className={`absolute bottom-4 right-4 p-2 rounded ${
          isPoseValid ? "bg-green-500" : "bg-red-500"
        } text-white`}
      >
        {isPoseValid ? "Pose Correct" : "Adjust Pose"}
      </div>
    </div>
  );
};

export default Processor;
