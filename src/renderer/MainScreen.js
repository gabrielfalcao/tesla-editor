import React from "react";
import { styled, keyframes } from "pretty-lights";

import appIcon from "@app.png";
import TopBar from "@app/renderer/TopBar";
import Editor from "@app/renderer/Editor";
import { useEditor } from "@app/renderer/EditorProvider";

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
  ${shake(x, y)}
`;

const Image = styled.img`
  position: fixed;
  top: 25%;
  left: 50%;

  animation: ${funky(0, 28)} 0.314s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-timing-function: ease-in-out;
  transform: translateY(28px);
`;
const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: #666;
  z-index: 1000;
  text-align: center;
`;

function Splash() {
  return (
    <Overlay>
      <Image src={appIcon} width="512" height="512" />
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
