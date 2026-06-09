import React from 'react';
import { profile } from '../data/projects';

export default function Hero() {
  return (
    <section className="hero" id="about">
      <div className="hero__content">
        <p className="hero__eyebrow">Developer Portfolio</p>
        <h1 className="hero__title">
          안녕하세요,
          <br />
          <span className="hero__name">{profile.name}</span>입니다
        </h1>
        <p className="hero__role">{profile.title}</p>
        <p className="hero__bio">{profile.bio}</p>
        <div className="hero__actions">
          <a href="#projects" className="btn btn--primary">
            프로젝트 보기
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--ghost"
          >
            GitHub →
          </a>
        </div>
        <div className="hero__stats">
          <div className="hero__stat">
            <span className="hero__stat-num">5+</span>
            <span className="hero__stat-label">프로젝트</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-num">Python</span>
            <span className="hero__stat-label">주력 언어</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-num">AI · IoT · Bot</span>
            <span className="hero__stat-label">관심 분야</span>
          </div>
        </div>
      </div>
    </section>
  );
}
