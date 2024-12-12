export type Order = 'asc' | 'desc';

export function getComparator<T, Key extends keyof T>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: T[key] },
  b: { [key in Key]: T[key] },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function descendingComparator<T, Key extends keyof T>(
  a: T,
  b: T,
  orderBy: Key
): number {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
