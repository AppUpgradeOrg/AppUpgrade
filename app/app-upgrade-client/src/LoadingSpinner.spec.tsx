import { render, screen } from '@testing-library/react';
import { LoadingSpinner, TEST_ID } from './LoadingSpinner';

test('<LoadingSpinner /> renders "Loading" by default', () => {
  render(<LoadingSpinner />);

  const linkElement = screen.getByTestId(TEST_ID);

  expect(linkElement.textContent).toBe('Loading');
  expect(linkElement).toBeInTheDocument();
});

test('<LoadingSpinner /> displays custom loading message', () => {
  render(<LoadingSpinner withText="hello world" />);

  const linkElement = screen.getByTestId(TEST_ID);

  expect(linkElement.textContent).toBe('hello world');
});

test('<LoadingSpinner /> hides "Loading" text when hideText is true', () => {
  render(<LoadingSpinner hideText />);

  const linkElement = screen.queryByTestId(TEST_ID);

  expect(linkElement).toBeNull();
});
