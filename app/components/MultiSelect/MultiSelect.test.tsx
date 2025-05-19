import { render } from '@testing-library/react';
import MultiMarkerSelect from './MultiSelect';

describe('Multiselect', () => {
  it('renders the component', () => {
    const { container } = render(<MultiMarkerSelect />);
    expect(container.firstChild).toBeDefined();
  });
});