import { render } from '@testing-library/react';
import MapProvider from './MultiSelectProvider';

describe('MultiMarkerSelect MapProvider', () => {
  it('renders the component', () => {
    const { container } = render(<MapProvider />);
    expect(container.firstChild).toBeDefined();
  });
});