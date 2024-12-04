"use client";

import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as posenet from "@tensorflow-models/posenet";

import "@tensorflow/tfjs-backend-webgl";

// Type definitions for positions, keypoints, poses, and joint angles
interface Position {
  x: number;
  y: number;
}

interface Keypoint {
  part: string; // The part of the body (e.g., leftShoulder)
  position: Position; // The position of the keypoint
  score: number; // Confidence score of the keypoint
}

interface Pose {
  keypoints: Keypoint[]; // Array of keypoints in the pose
}

interface JointAngles {
  [key: string]: Position | undefined; // Map of joint angles with part names as keys
}

// Define the connections between keypoints for drawing the skeleton
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

interface ProcessorProps {
  poseNo: string; // The pose number to analyze
}

const Processor: React.FC<ProcessorProps> = ({ poseNo }) => {
  const webcamRef = useRef<Webcam>(null); // Reference to the Webcam component
  const canvasRef = useRef<HTMLCanvasElement>(null); // Reference to the canvas element
  const [net, setNet] = useState<posenet.PoseNet | null>(null); // State for PoseNet model

  // Function to calculate the angle between three points using the arctangent
  const arcTanFunction = (
    a?: Position,
    b?: Position,
    c?: Position
  ): number | null => {
    if (!a || !b || !c) {
      console.log("Out of Frame."); // Log if any of the points are out of frame
      return null;
    }

    const theta =
      (Math.atan2(a.y - b.y, a.x - b.x) - Math.atan2(c.y - b.y, c.x - b.x)) *
      (180 / Math.PI);

    return theta;
  };

  // Function to draw the pose on the canvas
  const draw = (pose: Pose) => {
    const canvas = canvasRef.current; // Get the canvas element
    const video = webcamRef.current?.video; // Get the video element

    if (!canvas || !video) return; // Exit if either canvas or video is not available

    const ctx = canvas.getContext("2d"); // Get the 2D drawing context of the canvas
    if (!ctx) return; // Exit if the context is not available

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.drawImage(video, 0, 0, 650, 480, 0, 0, 650, 480); // Draw the video on the canvas

    const points = pose.keypoints; // Get the keypoints from the pose
    const jointAngles: JointAngles = {}; // Initialize an empty object to store joint angles

    for (let i = 0; i < points.length; i++) {
      const key = points[i]; // Current keypoint
      if (key.score > 0.2) {
        // If the confidence score is high enough
        ctx.beginPath(); // Start drawing
        ctx.arc(key.position.x, key.position.y, 2, 0, 2 * Math.PI); // Draw a circle at the keypoint position
        ctx.fillStyle = "#00FF00"; // Set the fill color to green
        ctx.stroke(); // Stroke the circle

        jointAngles[key.part] = key.position; // Store the position of the keypoint in jointAngles
      }
    }

    let changeColour = 0; // Initialize a flag to change the color of the skeleton lines

    // Calculate various yoga pose angles
    const yogaPoses = {
      pos1:
        jointAngles.leftShoulder &&
        jointAngles.leftElbow &&
        jointAngles.leftWrist
          ? 360 -
            (arcTanFunction(
              jointAngles.leftShoulder,
              jointAngles.leftElbow,
              jointAngles.leftWrist
            ) ?? 0)
          : null,
      pos2:
        jointAngles.rightShoulder &&
        jointAngles.rightElbow &&
        jointAngles.rightWrist
          ? arcTanFunction(
              jointAngles.rightShoulder,
              jointAngles.rightElbow,
              jointAngles.rightWrist
            )
          : null,
      pos3:
        jointAngles.rightEye && jointAngles.rightHip && jointAngles.rightKnee
          ? 180 +
            (arcTanFunction(
              jointAngles.rightEye,
              jointAngles.rightHip,
              jointAngles.rightKnee
            ) ?? 0)
          : null,
    };

    // Check for specific pose conditions and change the color accordingly
    if (poseNo === "pose1") {
      const ang1 = yogaPoses["pos1"];
      const ang2 = yogaPoses["pos2"];

      const maxAng1 = 200;
      const maxAng2 = 200;
      const minAng1 = 165;
      const minAng2 = 165;

      if (
        ang1 !== null &&
        ang2 !== null &&
        (minAng1 > ang1 || maxAng1 < ang1 || minAng2 > ang2 || maxAng2 < ang2)
      ) {
        console.log(ang1);
        changeColour = 1; // Change the color if the angles are out of range
      }
    } else if (poseNo === "pose2") {
      const ang3 = yogaPoses["pos3"];
      const maxAng3 = 40;
      // const minAng3 = 0;

      if (ang3 !== null && maxAng3 < ang3) {
        changeColour = 1; // Change the color if the angle is out of range
        console.log(ang3);
      }
    } else {
      changeColour = 1; // Default to change the color if poseNo is not recognized
      const theta = yogaPoses["pos3"];
      console.log(`Theta: ${theta}`);

      const THRESHOLD = 45;
      if (theta !== null && theta < THRESHOLD) {
        changeColour = 1; // Change the color if theta is below the threshold
      }
    }

    // Draw the skeleton lines
    for (let i = 0; i < connections.length; i++) {
      const link = connections[i];
      if (points[link[0]].score > 0.2 || points[link[1]].score > 0.2) {
        ctx.moveTo(points[link[0]].position.x, points[link[0]].position.y);
        ctx.lineTo(points[link[1]].position.x, points[link[1]].position.y);
        ctx.lineWidth = 4; // Set the line width
        ctx.strokeStyle = changeColour === 0 ? "red" : "green"; // Set the line color based on changeColour
        ctx.stroke(); // Stroke the line
      }
    }
  };

  // Function to run the pose estimation
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

  // Load PoseNet model on component mount
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

  // Set up interval to run pose estimation periodically
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (net) {
      intervalId = setInterval(runPose, 150);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [net, runPose]); // Added runPose to the dependency array

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
    </div>
  );
};

export default Processor;
