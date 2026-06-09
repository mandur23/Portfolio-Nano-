import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Footer from './components/Footer';
import { EasterEggProvider, useEasterEggs } from './context/EasterEggContext';
import './App.css';

function AppContent() {
  const { arisMode } = useEasterEggs();

  return (
    <div className={`app${arisMode ? ' app--aris' : ''}`}>
      <Header />
      <main>
        <Hero />
        <Projects />
        <Skills />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <EasterEggProvider>
      <AppContent />
    </EasterEggProvider>
  );
}

export default App;
