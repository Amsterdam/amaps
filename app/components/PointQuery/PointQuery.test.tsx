import { render } from '@testing-library/react';
import PointQuery from './PointQuery';

describe('Pointquery', () => {
  it('renders the component', () => {
    const { container } = render(<PointQuery />);
    expect(container.firstChild).toBeDefined();
  });
});