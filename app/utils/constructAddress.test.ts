import { constructAddress } from './constructAddress';

describe('constructAddress', () => {
  it('should construct a full address when all fields are provided', () => {
    const addressData = {
      openbare_ruimte: 'Main Street',
      huisnummer: 123,
      huisnummer_toevoeging: 'A',
      huisletter: 'B',
      postcode: '1234AB',
      woonplaats: 'Amsterdam',
    };

    const result = constructAddress(addressData);
    expect(result).toBe('Main Street 123B-A, 1234AB Amsterdam');
  });

  it('should construct an address without huisnummer_toevoeging', () => {
    const addressData = {
      openbare_ruimte: 'Main Street',
      huisnummer: 123,
      huisletter: 'B',
      postcode: '1234AB',
      woonplaats: 'Amsterdam',
    };

    const result = constructAddress(addressData);
    expect(result).toBe('Main Street 123B, 1234AB Amsterdam');
  });

  it('should construct an address without huisletter', () => {
    const addressData = {
      openbare_ruimte: 'Main Street',
      huisnummer: 123,
      huisnummer_toevoeging: 'A',
      postcode: '1234AB',
      woonplaats: 'Amsterdam',
    };

    const result = constructAddress(addressData);
    expect(result).toBe('Main Street 123-A, 1234AB Amsterdam');
  });

  it('should handle missing fields gracefully', () => {
    const addressData = {
      openbare_ruimte: 'Main Street',
      huisnummer: 123,
      postcode: '1234AB',
      woonplaats: 'Amsterdam',
    };

    const result = constructAddress(addressData);
    expect(result).toBe('Main Street 123, 1234AB Amsterdam');
  });

  it('should handle undefined input gracefully', () => {
    const result = constructAddress(undefined as any);
    expect(result).toBe('Er kon geen adres gevonden worden');
  });
});