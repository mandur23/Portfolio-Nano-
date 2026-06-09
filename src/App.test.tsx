import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders portfolio hero', () => {
  render(<App />);
  const titleElement = screen.getByText(/안녕하세요/i);
  expect(titleElement).toBeInTheDocument();
});
