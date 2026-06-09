import React from 'react';
import { skills } from '../data/projects';

export default function Skills() {
  return (
    <section className="skills" id="skills">
      <div className="section-header">
        <p className="section-eyebrow">Stack</p>
        <h2 className="section-title">기술 스택</h2>
      </div>
      <div className="skills__cloud">
        {skills.map((skill) => (
          <span key={skill} className="skills__item">
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
