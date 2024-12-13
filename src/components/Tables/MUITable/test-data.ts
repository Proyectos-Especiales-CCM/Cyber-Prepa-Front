import { HeadCell } from "./TableHead";
export interface Data {
  id: number;
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}

function createData(
  id: number,
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
): Data {
  return {
    id,
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}

export const rows = [
  createData(1, 'Cupcake', 305, 3.7, 67, 4.3),
  createData(2, 'Donut', 452, 25.0, 51, 4.9),
  createData(3, 'Eclair', 262, 16.0, 24, 6.0),
  createData(4, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData(5, 'Gingerbread', 356, 16.0, 49, 3.9),
  createData(6, 'Honeycomb', 408, 3.2, 87, 6.5),
  createData(7, 'Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData(8, 'Jelly Bean', 375, 0.0, 94, 0.0),
  createData(9, 'KitKat', 518, 26.0, 65, 7.0),
  createData(10, 'Lollipop', 392, 0.2, 98, 0.0),
  createData(11, 'Marshmallow', 318, 0, 81, 2.0),
  createData(12, 'Nougat', 360, 19.0, 9, 37.0),
  createData(13, 'Oreo', 437, 18.0, 63, 4.0),
  createData(14, 'Pie', 305, 3.7, 67, 4.3),
  createData(15, 'Quiche', 452, 25.0, 51, 4.9),
  createData(16, 'Raspberry', 262, 16.0, 24, 6.0),
  createData(17, 'Strawberry', 159, 6.0, 24, 4.0),
  createData(18, 'Tiramisu', 356, 16.0, 49, 3.9),
  createData(19, 'Ugli fruit', 408, 3.2, 87, 6.5),
  createData(20, 'Vanilla', 237, 9.0, 37, 4.3),
  createData(21, 'Waffle', 375, 0.0, 94, 0.0),
  createData(22, 'Xigua', 518, 26.0, 65, 7.0),
  createData(23, 'Yogurt', 392, 0.2, 98, 0.0),
  createData(24, 'Zucchini', 318, 0, 81, 2.0),
  createData(25, 'Apple', 360, 19.0, 9, 37.0),
  createData(26, 'Banana', 437, 18.0, 63, 4.0),
  createData(27, 'Cherry', 305, 3.7, 67, 4.3),
  createData(28, 'Date', 452, 25.0, 51, 4.9),
  createData(29, 'Elderberry', 262, 16.0, 24, 6.0),
  createData(30, 'Fig', 159, 6.0, 24, 4.0),
  createData(31, 'Grape', 356, 16.0, 49, 3.9),
];

export const headCells: HeadCell<typeof rows[0]>[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Dessert (100g serving)',
  },
  {
    id: 'calories',
    numeric: true,
    disablePadding: false,
    label: 'Calories',
  },
  {
    id: 'fat',
    numeric: true,
    disablePadding: false,
    label: 'Fat (g)',
  },
  {
    id: 'carbs',
    numeric: true,
    disablePadding: false,
    label: 'Carbs (g)',
  },
  {
    id: 'protein',
    numeric: true,
    disablePadding: false,
    label: 'Protein (g)',
  },
];
