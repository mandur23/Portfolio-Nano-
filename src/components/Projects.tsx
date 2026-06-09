import React from 'react';
import { projects, wipProject, type Project } from '../data/projects';
import { useEasterEggs } from '../context/EasterEggContext';

function ProjectCard({
  project,
  index,
  isWip = false,
}: {
  project: Project;
  index: number;
  isWip?: boolean;
}) {
  return (
    <article
      key={project.id}
      className={`project-card${isWip ? ' project-card--wip' : ''}`}
      style={
        {
          '--accent': project.accent,
          '--delay': `${index * 0.08}s`,
        } as React.CSSProperties
      }
    >
      <div className="project-card__top">
        <span className="project-card__icon">{project.icon}</span>
        {isWip ? (
          <span className="project-card__wip-badge">WIP</span>
        ) : (
          project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__github"
              aria-label={`${project.title} GitHub`}
            >
              ↗
            </a>
          )
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
  );
}

export default function Projects() {
  const { wipUnlocked } = useEasterEggs();
  const visibleProjects = wipUnlocked ? [...projects, wipProject] : projects;

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
        {visibleProjects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            isWip={project.id === wipProject.id}
          />
        ))}
      </div>
    </section>
  );
}
