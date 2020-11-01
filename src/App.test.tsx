import React from 'react';
// @ts-ignore I have no idea why it thinks screen isn't in there.
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const app = render(<App />);
  // screen.debug();
});
