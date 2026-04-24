import { describe, expect, it } from 'vitest';

import { adaptRouteMonths, adaptVehicleRouteMap } from '../adapters/companyRoutes.adapter';

describe('companyRoutes.adapter', () => {
  it('formats month labels when backend does not provide one', () => {
    const result = adaptRouteMonths([{ month: '2026-01' }]);

    expect(result).toHaveLength(1);
    expect(result[0].value).toBe('2026-01');
    expect(result[0].label.toLowerCase()).toContain('2026');
  });

  it('creates safe defaults when route map payload is empty', () => {
    const map = adaptVehicleRouteMap({}, []);

    expect(map.path).toHaveLength(0);
    expect(map.startPoint).toBeNull();
    expect(map.endPoint).toBeNull();
    expect(map.stats.totalPoints).toBe(0);
    expect(map.stats.timeRangeLabel).toBe('Sin rango temporal');
  });
});
