"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import basketballImage from "../../assets/Basketball.png";
import footballImage from "../../assets/Football.png";
import faceImage from "../../assets/face.jpg";
import fieldImage from "../../assets/field.png";
import volleyballImage from "../../assets/volleyball.png";
import "./animation.css";

const FIELD_WIDTH = 1000;
const FIELD_HEIGHT = 680;
const BALL_DIAMETER = 200;
const BALL_SPEED = 150;
const FRAME_RATE = 60;

const ballTypes = [
  { id: "none", label: "None", shortcut: "0", image: null },
  { id: "Basketball", label: "Basketball", shortcut: "1", image: basketballImage.src },
  { id: "Football", label: "Football", shortcut: "2", image: footballImage.src },
  { id: "volleyball", label: "Volleyball", shortcut: "3", image: volleyballImage.src },
  { id: "face", label: "Face", shortcut: "4", image: faceImage.src },
];

export default function Page() {
  const [ballType, setBallType] = useState(ballTypes[0]);
  const [running, setRunning] = useState(false);
  const [position, setPosition] = useState({ x: 10, y: 10, rotation: 0 });
  const positionRef = useRef(position);
  const directionRef = useRef({ x: 1, y: 1 });

  const toggleRunning = useCallback(() => {
    setRunning((previous) => !previous);
  }, []);

  // keyboard event
  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(target.tagName))
      ) {
        return;
      }

      if (event.altKey || event.ctrlKey || event.metaKey) return;

      if (event.code === "Space") {
        event.preventDefault();
        toggleRunning();
        return;
      }

      const selectedBall = ballTypes.find((ball) => ball.shortcut === event.key);
      if (selectedBall) setBallType(selectedBall);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleRunning]);

  useEffect(() => {
    if (!running) return undefined;

    const maxX = FIELD_WIDTH - BALL_DIAMETER;
    const maxY = FIELD_HEIGHT - BALL_DIAMETER;
    let frameId;
    let previousTime;

    const animate = (time) => {
      const elapsed = previousTime === undefined
        ? 0
        : Math.min((time - previousTime) / 1000, 1 / FRAME_RATE * 2);
      previousTime = time;

      const current = positionRef.current;
      let nextX = current.x + directionRef.current.x * BALL_SPEED * elapsed;
      let nextY = current.y + directionRef.current.y * BALL_SPEED * elapsed;

      if (nextX >= maxX) {
        nextX = maxX - (nextX - maxX);
        directionRef.current.x = -1;
      } else if (nextX <= 0) {
        nextX = -nextX;
        directionRef.current.x = 1;
      }

      if (nextY >= maxY) {
        nextY = maxY - (nextY - maxY);
        directionRef.current.y = -1;
      } else if (nextY <= 0) {
        nextY = -nextY;
        directionRef.current.y = 1;
      }

      const nextPosition = {
        x: nextX,
        y: nextY,
        rotation: (current.rotation + 300 * elapsed) % 360,
      };
      positionRef.current = nextPosition;
      setPosition(nextPosition);
      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [running]);

  return (
    <main className="animation-page">
      <section className="animation-wrap" aria-label="Ball animation">
        <div
          className="animation-field"
          role="img"
          aria-label="สนามสำหรับแอนิเมชัน"
          style={{ backgroundImage: `url("${fieldImage.src}")` }}
        >
          <div
            className="animation-ball"
            role="img"
            aria-label={ballType.label}
            style={{
              left: `${(position.x / FIELD_WIDTH) * 100}%`,
              top: `${(position.y / FIELD_HEIGHT) * 100}%`,
              transform: `rotate(${position.rotation}deg)`,
              backgroundImage: ballType.image ? `url("${ballType.image}")` : "none",
            }}
          />
        </div>

        <div className="animation-controls">
          <button
            className={`animation-button animation-play${running ? " is-running" : ""}`}
            type="button"
            onClick={toggleRunning}
            aria-pressed={running}
          >
            <span aria-hidden="true">{running ? "Ⅱ" : "▶"}</span>
            {running ? "Pause" : "Play"}
          </button>

          <div className="animation-ball-options" aria-label="เลือกวัตถุ">
            {ballTypes.map((ball) => (
              <button
                className={`animation-button${ballType.id === ball.id ? " is-selected" : ""}`}
                key={ball.id}
                type="button"
                onClick={() => setBallType(ball)}
                aria-pressed={ballType.id === ball.id}
              >
                {ball.label}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
