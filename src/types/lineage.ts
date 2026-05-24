export type TransformKind =
  | 'AGGREGATE'
  | 'ARITHMETIC'
  | 'CAST'
  | 'JOIN'
  | 'FILTER'
  | 'RENAME'
  | 'SOURCE';

export interface TransformMeta {
  label: string;
  hue: number;
  sat?: number;
}

export interface LineageNode {
  id: string;
  name: string;
  table: string;
  transformation: string;
  type: TransformKind;
  dataType: string;
  parents: string[];
  isTarget?: boolean;
}

export type LineageMap = Record<string, LineageNode>;

export interface Position {
  x: number;
  y: number;
}

export type Positions = Record<string, Position>;

export interface Viewport {
  x: number;
  y: number;
  scale: number;
}

export interface CanvasSize {
  w: number;
  h: number;
}
