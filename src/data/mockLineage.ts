import type { LineageMap, TransformKind } from '../types/lineage';
import {
  COL_PARTS_A,
  COL_PARTS_B,
  SAMPLE_DATA_TYPES,
  SAMPLE_SQL,
  SAMPLE_TABLES,
  TRANSFORM_KINDS,
} from '../constants/lineage';

interface GeneratedLineage {
  lineage: LineageMap;
  targetId: string;
}

const generateLineage = (): GeneratedLineage => {
  const lineage: LineageMap = {};
  let counter = 0;
  const rand = (n: number) => Math.floor(Math.random() * n);
  const pick = <T,>(arr: T[]): T => arr[rand(arr.length)];

  const build = (depth: number, maxDepth: number): string => {
    const id = `col_${counter++}`;
    const transformKeys = (Object.keys(TRANSFORM_KINDS) as TransformKind[]).filter(
      (k) => k !== 'SOURCE',
    );
    const isLeaf = depth >= maxDepth;
    const type: TransformKind = isLeaf ? 'SOURCE' : pick(transformKeys);
    const numParents = isLeaf ? 0 : depth === 0 ? 3 : Math.max(1, rand(3) + 1);
    const parents: string[] = [];
    for (let i = 0; i < numParents; i++) {
      parents.push(build(depth + 1, maxDepth));
    }
    lineage[id] = {
      id,
      name: `${pick(COL_PARTS_A)}_${pick(COL_PARTS_B)}`,
      table: pick(SAMPLE_TABLES),
      transformation: SAMPLE_SQL[type],
      type,
      dataType: pick(SAMPLE_DATA_TYPES),
      parents,
    };
    return id;
  };

  const targetId = build(0, 6);
  const t = lineage[targetId];
  t.name = 'total_net_revenue_usd';
  t.table = 'analytics.revenue_summary';
  t.transformation =
    'SUM(net_amount * fx_rate) - SUM(refund_amount * fx_rate)';
  t.type = 'AGGREGATE';
  t.dataType = 'DECIMAL(18,2)';
  t.isTarget = true;

  return { lineage, targetId };
};

const { lineage, targetId } = generateLineage();

export const LINEAGE_DB: LineageMap = lineage;
export const TARGET_ID: string = targetId;
