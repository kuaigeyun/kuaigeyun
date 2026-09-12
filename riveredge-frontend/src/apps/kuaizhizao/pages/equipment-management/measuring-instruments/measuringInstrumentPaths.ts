export const KUAIZHIZAO_MEASURING_INSTRUMENT_LIST_PATH =
  '/apps/kuaizhizao/equipment-management/measuring-instruments';

export function buildMeasuringInstrumentDetailPath(uuid: string, tab?: string): string {
  const base = `${KUAIZHIZAO_MEASURING_INSTRUMENT_LIST_PATH}/${uuid}`;
  return tab ? `${base}?tab=${encodeURIComponent(tab)}` : base;
}

export type MeasuringInstrumentDetailTabKey = 'info' | 'calibrations';

export function resolveMeasuringInstrumentDetailTabKey(
  raw: string | null,
): MeasuringInstrumentDetailTabKey {
  if (raw === 'calibrations') return 'calibrations';
  return 'info';
}
