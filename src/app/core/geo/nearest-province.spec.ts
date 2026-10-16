import { nearestProvince } from './nearest-province';

describe('nearestProvince', () => {
  it('returns the province of a point near its capital', () => {
    expect(nearestProvince(40.45, -3.69)).toBe('Madrid');
    expect(nearestProvince(39.48, -0.35)).toBe('Valencia');
    expect(nearestProvince(28.1, -15.42)).toBe('Las Palmas');
  });

  it('returns null far away from Spain', () => {
    expect(nearestProvince(48.85, 2.35)).toBeNull(); // Paris
  });
});
