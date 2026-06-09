import React from 'react';
import { profile } from '../data/projects';

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer__inner">
        <div>
          <h2 className="footer__title">함께 일해요</h2>
          <p className="footer__text">
            새로운 프로젝트나 협업 제안이 있으시면 언제든 연락해 주세요.
          </p>
        </div>
        <div className="footer__links">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            GitHub
          </a>
          <a href={`mailto:${profile.email}`} className="footer__link">
            Email
          </a>
        </div>
      </div>
      <p className="footer__copy">
        © {new Date().getFullYear()} {profile.name}. Built with React.
      </p>
    </footer>
  );
}
