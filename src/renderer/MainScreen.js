import React from "react";
import { styled, keyframes } from "pretty-lights";

import appIcon from "@app.png";
import TopBar from "@app/renderer/TopBar";
import Editor from "@app/renderer/Editor";
import { Widget } from "@app/renderer/Editor/Widget";
import { useEditor } from "@app/renderer/Editor/Provider";

const shakeSteps = [
  { translation: [1, 1], rotation: 0 },
  { translation: [-1, -2], rotation: -1 },
  { translation: [-3, 0], rotation: 1 },
  { translation: [3, 2], rotation: 0 },
  { translation: [1, -1], rotation: 1 },
  { translation: [-1, 2], rotation: -1 },
  { translation: [-3, 1], rotation: 0 },
  { translation: [3, 1], rotation: -1 },
  { translation: [-1, -1], rotation: 1 },
  { translation: [1, 2], rotation: 0 },
  { translation: [1, -2], rotation: -1 },
];

const shake = (x = 0, y = 0, coefficient = 5) => {
  const parts = [];
  Object.entries(shakeSteps).forEach(([index, delta]) => {
    const cursor = index + 1;
    const percentage = cursor * 10;
    parts.push(
      `${percentage}% { transform: translate(${
        x * coefficient + delta.translation[0]
      }px, ${y * coefficient + delta.translation[0]}px) rotate(${
        delta.rotation
      }deg); }`
    );
  });
  return parts.join("\n");
};

const funky = (x, y) => keyframes`
  0% {
    transform: scale(0.9);
  }

  25% {
    transform: scale(1);
  }

  60% {
    transform: scale(0.9);
  }

  100% {
    transform: scale(0.9);
  }
`;

const Image = styled.img`
  position: relative;
  top: 50%;
  left: 50%;

  animation: breathing 0.314s ease-out infinite normal;
`;
const Overlay = styled.div`
  background: #333;
  z-index: 10000;
  text-align: center;
`;

function Splash() {
  return (
    <Overlay className="h-100 w-100">
      <Image src={appIcon} width="256" height="256" />
      <br />
      <h1 style={{ color: "#fff" }}>loading...</h1>
    </Overlay>
  );
}
const Main = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;
export default function MainScreen() {
  const { instance } = useEditor();
  return (
    <Main>
      {instance ? <TopBar /> : <Splash />}
      <Editor />
    </Main>
  );
}
