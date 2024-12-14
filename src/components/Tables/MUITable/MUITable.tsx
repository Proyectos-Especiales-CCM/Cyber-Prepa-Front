import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';

import { EnhancedTableHead, HeadCell } from './TableHead';
import { EnhancedTableToolbar } from './Toolbar';

import { getComparator, Order } from './utils';

export interface CustomCell<T> { 
  id: keyof T; 
  render: (row: T, key: keyof T) => React.ReactNode; 
}

export interface EnhancedTableProps<T extends { id: number }> extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  data: T[];
  headCells?: HeadCell<T>[];
  defaultOrderBy?: keyof T;
  excludedColumns?: (keyof T)[];
  customCells?: CustomCell<T>[];
}

export default function EnhancedTable<T extends { id: number }>({
  data,
  headCells: passedHeadCells,
  defaultOrderBy,
  excludedColumns,
  customCells,
  ...rest
}: EnhancedTableProps<T>) {
  const [state, setState] = React.useState({
    order: 'asc' as Order,
    orderBy: defaultOrderBy || 'id' as keyof T,
    selected: [] as readonly number[],
    page: 0,
    rowsPerPage: 5,
    searchQuery: '',
    currentData: data,
    visibleRows: data,
    emptyRows: 0,
  });

  const generateHeadCells = React.useCallback((): HeadCell<T>[] => {
    if (data.length === 0) return [];
    return Object.keys(data[0])
      .filter((key) => !(excludedColumns || []).includes(key as keyof T))
      .map((key) => ({
        id: key as keyof T,
        disablePadding: false,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        numeric: typeof data[0][key as keyof T] === 'number',
      }));
  }, [data, excludedColumns]);

  const headCells = passedHeadCells || generateHeadCells();

  const handleSearch = (query: string) => {
    setState((prevState) => ({ ...prevState, searchQuery: query.toLowerCase() }));
  };

  React.useEffect(() => {
    const filteredData = data.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(state.searchQuery)
      )
    );
    setState((prevState) => ({ ...prevState, currentData: filteredData }));
  }, [data, state.searchQuery]);

  React.useEffect(() => {
    const sortedData = [...state.currentData].sort(
      getComparator<T, keyof T>(state.order, state.orderBy)
    );
    const paginatedData = sortedData.slice(
      state.page * state.rowsPerPage,
      state.page * state.rowsPerPage + state.rowsPerPage
    );
    const calculatedEmptyRows = Math.max(
      0,
      (1 + state.page) * state.rowsPerPage - state.currentData.length
    );
    setState((prevState) => ({
      ...prevState,
      visibleRows: paginatedData,
      emptyRows: calculatedEmptyRows,
    }));
  }, [state.currentData, state.order, state.orderBy, state.page, state.rowsPerPage]);

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof T) => {
    const isAsc = state.orderBy === property && state.order === 'asc';
    setState((prevState) => ({
      ...prevState,
      order: isAsc ? 'desc' : 'asc',
      orderBy: property,
    }));
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = state.currentData.map((n) => n.id);
      setState((prevState) => ({ ...prevState, selected: newSelected }));
    } else {
      setState((prevState) => ({ ...prevState, selected: [] }));
    }
  };

  const handleClick = (_event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = state.selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(state.selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(state.selected.slice(1));
    } else if (selectedIndex === state.selected.length - 1) {
      newSelected = newSelected.concat(state.selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        state.selected.slice(0, selectedIndex),
        state.selected.slice(selectedIndex + 1)
      );
    }
    setState((prevState) => ({ ...prevState, selected: newSelected }));
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setState((prevState) => ({ ...prevState, page: newPage }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    }));
  };

  return (
    <div {...rest}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={state.selected.length}
          selected={state.selected}
          onSearch={handleSearch}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="small"
          >
            <EnhancedTableHead
              headCells={headCells}
              numSelected={state.selected.length}
              order={state.order}
              orderBy={state.orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={state.currentData.length}
            />
            <TableBody>
              {state.visibleRows.map((row, index) => {
                const isItemSelected = state.selected.includes(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    {headCells.map((headCell, cellIndex) => (
                      <TableCell
                        key={String(headCell.id)}
                        component={cellIndex === 0 ? "th" : undefined}
                        id={cellIndex === 0 ? labelId : undefined}
                        scope={cellIndex === 0 ? "row" : undefined}
                        padding="normal"
                      >
                        {customCells &&
                        customCells.some((renderer) => renderer.id === headCell.id)
                          ? customCells
                              .find((renderer) => renderer.id === headCell.id)
                              ?.render(row, headCell.id)
                          : String(row[headCell.id])}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
              {state.emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * state.emptyRows,
                  }}
                >
                  <TableCell colSpan={headCells.length + 1} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={state.currentData.length}
          rowsPerPage={state.rowsPerPage}
          page={state.page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
