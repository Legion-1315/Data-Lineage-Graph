import type { TransformKind, TransformMeta } from '../types/lineage';

export const TRANSFORM_KINDS: Record<TransformKind, TransformMeta> = {
  AGGREGATE: { label: 'AGGREGATE', hue: 38 },
  ARITHMETIC: { label: 'ARITHMETIC', hue: 265 },
  CAST: { label: 'CAST', hue: 190 },
  JOIN: { label: 'JOIN', hue: 330 },
  FILTER: { label: 'FILTER', hue: 150 },
  RENAME: { label: 'RENAME', hue: 215 },
  SOURCE: { label: 'SOURCE', hue: 0, sat: 0 },
};

export const NODE_W = 280;
export const NODE_H = 108;
export const LVL_GAP = 80;
export const SIB_GAP = 22;

export const MIN_ZOOM = 0.25;
export const MAX_ZOOM = 2.2;
export const ZOOM_STEP = 1.2;
export const WHEEL_ZOOM_FACTOR = 0.0015;

export const SAMPLE_TABLES = [
  'analytics.revenue_summary',
  'analytics.daily_kpis',
  'staging.txn_clean',
  'staging.refund_clean',
  'staging.fx_normalized',
  'staging.customers_dim',
  'staging.orders_enriched',
  'raw.stripe_charges',
  'raw.stripe_refunds',
  'raw.fx_rates_api',
  'raw.orders',
  'raw.order_items',
  'raw.customers',
  'raw.signups',
];

export const COL_PARTS_A = [
  'total',
  'gross',
  'net',
  'avg',
  'sum',
  'cnt',
  'adj',
  'norm',
  'final',
  'raw',
  'std',
  'wtd',
];

export const COL_PARTS_B = [
  'amount',
  'revenue',
  'value',
  'price',
  'count',
  'fee',
  'tax',
  'discount',
  'qty',
  'rate',
];

export const SAMPLE_SQL: Record<TransformKind, string> = {
  AGGREGATE: 'SUM(amount) OVER (PARTITION BY day ORDER BY ts)',
  ARITHMETIC: 'gross_amount - discount_amount * fx_rate',
  CAST: 'CAST(value AS DECIMAL(18,2))',
  JOIN: 'LEFT JOIN customers c ON t.customer_id = c.id',
  FILTER: "WHERE status = 'completed' AND deleted_at IS NULL",
  RENAME: 'AS new_canonical_name',
  SOURCE: '-- ingested from upstream system',
};

export const SAMPLE_DATA_TYPES = [
  'DECIMAL(18,2)',
  'BIGINT',
  'VARCHAR(64)',
  'TIMESTAMP',
  'DOUBLE',
];
