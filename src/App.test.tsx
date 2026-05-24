import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Column Lineage header', () => {
  render(<App />);
  expect(screen.getByText(/column lineage/i)).toBeInTheDocument();
});
