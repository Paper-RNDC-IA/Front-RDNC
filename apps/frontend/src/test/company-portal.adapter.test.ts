import { describe, expect, it } from 'vitest';

import {
  adaptInsightCategories,
  adaptInsightKpis,
  adaptInsightNotes,
  adaptInsightRows,
  adaptInsightTrend,
} from '../adapters/company-portal.adapter';
import type { CompanyFileInsightApi } from '../types/company-portal';

describe('company-portal adapter', () => {
  it('adapts insight payloads when backend sends objects instead of arrays', () => {
    const payload = {
      file_id: 'file-1',
      kpis: {
        total_registros: 123,
        pendientes: 4,
      },
      trend: {
        '2026-01': 80,
        '2026-02': 43,
      },
      categories: {
        cumplidos: 90,
        observados: 33,
      },
      notes: {
        alerta: 'Hay datos faltantes',
      },
    } as unknown as CompanyFileInsightApi;

    const kpis = adaptInsightKpis(payload);
    const trend = adaptInsightTrend(payload);
    const categories = adaptInsightCategories(payload);
    const notes = adaptInsightNotes(payload);
    const rows = adaptInsightRows(payload);

    expect(kpis.length).toBe(2);
    expect(trend.length).toBe(2);
    expect(categories.length).toBe(2);
    expect(notes.length).toBe(1);
    expect(rows.length).toBe(2);
  });
});
