'use client';

import Image from "next/image";
import studentImage from "../assets/student.jpg";
import developerImage from "../assets/developer.png";

function App() {
  return (
    <div className="course-card">
      {/* ฝั่งซ้าย: ข้อมูลนักเรียน */}
      <div className="teacher-card">
        <Image
          src={studentImage}
          alt="Student"
          className="teacher-image"
        />

        <div className="teacher-info">
          <strong>Pin Chatkaewmanee, D.Eng. (Instructor)</strong>
          <p>Computer Science and Software Development</p>
          <p>Innovation Dept. (CSI)</p>
          <p>School of Information Technology (SIT)</p>
          <p>Sripatum University (SPU)</p>
        </div>
      </div>

      {/* ฝั่งขวา: รายละเอียดรายวิชา */}
      <div className="course-content">
        <h4>
          CSI205 Front-End Software Development covers:
        </h4>

        <ul>
          <li>
            <strong>UX/UI Fundamentals:</strong>{" "}
            Review the fundamentals of user-friendly web interface design with UX research (covered in previous courses).
          </li>

          <li>
            <strong>Traditional HTML/CSS/JS:</strong>{" "}
            Learn from the ground up by using basic HTML tags, then simplify web pages with CSS, and finally write JavaScript to interact with users or handle DOM events within web pages.
          </li>

          <li>
            <strong>React Web Applications:</strong>{" "}
            Start with basic React concepts such as the Virtual DOM, class and function components, props and state, followed by numerous React hook examples.
          </li>

          <li>
            <strong>Back-End Interface Preparation:</strong>{" "}
            Examples prepared for future back-end interfaces via APIs.
          </li>

          <li>
            <strong>DevOps Fundamentals:</strong>{" "}
            Topics such as virtual machines, container technologies, version control, and deployment tools.
          </li>
        </ul>

        <p className="course-footer">I hope you enjoy this course :)</p>

        <Image
          src={developerImage}
          alt="Developer illustration"
          className="developer-image"
        />
      </div>
    </div>
  );
}

export default App;