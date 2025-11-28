import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the About section', () => {
  render(<App />);
  const aboutHeading = screen.getByRole('heading', { name: /about/i });
  expect(aboutHeading).toBeInTheDocument();
});
