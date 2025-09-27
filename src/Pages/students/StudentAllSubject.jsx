import React, { useState } from "react";

const StudentAllSubject = () => {
  const [subjects] = useState([
    { name: "Physics", code: "PHY-11", instructor: "Dr. Rakesh Sharma", progress: 80, syllabus: [
      { chapterNumber: 1, chapter: "Physical World and Measurement", topics: ["Units and Dimensions", "Errors in Measurement", "Dimensional Analysis"] },
      { chapterNumber: 2, chapter: "Kinematics", topics: ["Motion in a Straight Line", "Motion in a Plane", "Projectile Motion"] },
      { chapterNumber: 3, chapter: "Laws of Motion", topics: ["Newton's Laws", "Friction", "Circular Motion"] },
      { chapterNumber: 4, chapter: "Work, Energy and Power", topics: ["Work-Energy Theorem", "Conservation of Energy", "Power"] },
      { chapterNumber: 5, chapter: "Motion of System of Particles and Rigid Body", topics: ["Centre of Mass", "Torque", "Angular Momentum"] },
      { chapterNumber: 6, chapter: "Gravitation", topics: ["Universal Law of Gravitation", "Gravitational Potential", "Kepler's Laws"] },
    ]},
    { name: "Chemistry", code: "CHEM-11", instructor: "Dr. Priya Gupta", progress: 65, syllabus: [
      { chapterNumber: 1, chapter: "Some Basic Concepts of Chemistry", topics: ["Mole Concept", "Stoichiometry", "Atomic Structure"] },
      { chapterNumber: 2, chapter: "Structure of Atom", topics: ["Bohr's Model", "Quantum Numbers", "Electronic Configuration"] },
      { chapterNumber: 3, chapter: "Classification of Elements and Periodicity", topics: ["Periodic Table", "Periodic Trends", "s, p, d, f Blocks"] },
      { chapterNumber: 4, chapter: "Chemical Bonding and Molecular Structure", topics: ["VSEPR Theory", "Hybridization", "Hydrogen Bonding"] },
      { chapterNumber: 5, chapter: "States of Matter", topics: ["Gas Laws", "Intermolecular Forces", "Liquid State"] },
      { chapterNumber: 6, chapter: "Thermodynamics", topics: ["First Law", "Enthalpy", "Hess’s Law"] },
    ]},
    { name: "Mathematics", code: "MATH-11", instructor: "Prof. Anil Kumar", progress: 75, syllabus: [
      { chapterNumber: 1, chapter: "Sets", topics: ["Types of Sets", "Operations on Sets", "Venn Diagrams"] },
      { chapterNumber: 2, chapter: "Relations and Functions", topics: ["Cartesian Product", "Types of Functions", "Domain and Range"] },
      { chapterNumber: 3, chapter: "Trigonometric Functions", topics: ["Trigonometric Identities", "Graphs", "Applications"] },
      { chapterNumber: 4, chapter: "Principle of Mathematical Induction", topics: ["Proof by Induction", "Applications"] },
      { chapterNumber: 5, chapter: "Complex Numbers and Quadratic Equations", topics: ["Complex Numbers", "Argand Plane", "Quadratic Roots"] },
      { chapterNumber: 6, chapter: "Linear Inequalities", topics: ["Graphical Solutions", "System of Inequalities"] },
    ]},
    { name: "English", code: "ENG-11", instructor: "Ms. Shalini Verma", progress: 85, syllabus: [
      { chapterNumber: 1, chapter: "Prose", topics: ["The Portrait of a Lady", "We’re Not Afraid to Die", "Discovering Tut"] },
      { chapterNumber: 2, chapter: "Poetry", topics: ["A Photograph", "The Voice of the Rain", "Childhood"] },
      { chapterNumber: 3, chapter: "Supplementary Reader", topics: ["The Summer of the Beautiful White Horse", "The Address"] },
      { chapterNumber: 4, chapter: "Grammar", topics: ["Tenses", "Modals", "Active-Passive Voice"] },
      { chapterNumber: 5, chapter: "Writing Skills", topics: ["Notice Writing", "Letter Writing", "Article Writing"] },
    ]},
    { name: "Computer Science", code: "CS-11", instructor: "Mr. Vikram Patel", progress: 60, syllabus: [
      { chapterNumber: 1, chapter: "Computer Fundamentals", topics: ["Hardware vs Software", "Types of Software", "Number Systems"] },
      { chapterNumber: 2, chapter: "Programming Methodology", topics: ["Algorithms", "Flowcharts", "Pseudocode"] },
      { chapterNumber: 3, chapter: "Introduction to Python", topics: ["Variables", "Data Types", "Operators"] },
      { chapterNumber: 4, chapter: "Conditional and Looping Constructs", topics: ["if-else", "for Loop", "while Loop"] },
      { chapterNumber: 5, chapter: "Functions in Python", topics: ["Defining Functions", "Parameters", "Recursion"] },
    ]},
  ]);

  const [selectedSubject, setSelectedSubject] = useState(null);

  const SubjectCard = ({ subject, index }) => (
    <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{subject.name}</h2>
          <p className="text-sm text-gray-600">Code: {subject.code}</p>
          <p className="text-sm text-gray-600">Instructor: {subject.instructor}</p>
        </div>
        <button
          onClick={() => setSelectedSubject(subject)}
          className="mt-2 px-4 py-1 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
        >
          View Syllabus
        </button>
      </div>
      <div className="mt-3">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${subject.progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-1">{subject.progress}% Complete</p>
      </div>
    </div>
  );

  const SyllabusModal = ({ subject, onClose }) => (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h2 className="text-2xl font-bold text-indigo-700">{subject.name} Syllabus</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-3xl font-bold transition-colors">×</button>
        </div>
        <div className="space-y-6">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 font-medium">Course Code: <span className="text-indigo-600">{subject.code}</span></p>
            <p className="text-sm text-gray-700 font-medium">Instructor: <span className="text-indigo-600">{subject.instructor}</span></p>
            <p className="text-sm text-gray-700 font-medium">Progress: <span className="text-indigo-600">{subject.progress}% Complete</span></p>
          </div>
          {subject.syllabus.map((chapter, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <h4 className="text-lg font-semibold text-indigo-600 mb-2">Chapter {chapter.chapterNumber}: {chapter.chapter}</h4>
              <ul className="space-y-2">
                {chapter.topics.map((topic, idx) => (
                  <li key={idx} className="flex items-center text-gray-700 text-sm">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors shadow-md">
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="w-full bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-indigo-600">All Subjects (Class 11 - PCM Stream)</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => <SubjectCard subject={subject} index={index} />)}
        </div>
      </div>
      {selectedSubject && <SyllabusModal subject={selectedSubject} onClose={() => setSelectedSubject(null)} />}
    </div>
  );
};

export default StudentAllSubject;