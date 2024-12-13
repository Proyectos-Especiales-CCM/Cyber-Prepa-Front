export type Order = 'asc' | 'desc';

export function getComparator<T, Key extends keyof T>(
  order: Order,
  orderBy: Key,
): (a: T, b: T) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a[orderBy], b[orderBy])
    : (a, b) => -descendingComparator(a[orderBy], b[orderBy]);
}

function descendingComparator<T>(a: T, b: T): number {
  if (b < a) return -1;
  if (b > a) return 1;
  return 0;
}

