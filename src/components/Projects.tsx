import React from 'react';
import { projects } from '../data/projects';

export default function Projects() {
  return (
    <section className="projects" id="projects">
      <div className="section-header">
        <p className="section-eyebrow">Works</p>
        <h2 className="section-title">프로젝트</h2>
        <p className="section-desc">
          지금까지 개발한 주요 프로젝트입니다. 각 카드를 클릭하면 GitHub 저장소로
          이동합니다.
        </p>
      </div>
      <div className="projects__grid">
        {projects.map((project, index) => (
          <article
            key={project.id}
            className="project-card"
            style={{ '--accent': project.accent, '--delay': `${index * 0.08}s` } as React.CSSProperties}
          >
            <div className="project-card__top">
              <span className="project-card__icon">{project.icon}</span>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card__github"
                  aria-label={`${project.title} GitHub`}
                >
                  ↗
                </a>
              )}
            </div>
            <h3 className="project-card__title">{project.title}</h3>
            <p className="project-card__subtitle">{project.subtitle}</p>
            <p className="project-card__desc">{project.description}</p>
            <ul className="project-card__highlights">
              {project.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="project-card__tags">
              {project.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
