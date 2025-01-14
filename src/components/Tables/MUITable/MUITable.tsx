import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import React, { useCallback } from 'react';
import { EnhancedTableHead, HeadCell } from './TableHead';
import { CustomSelectedToolbarProps, EnhancedTableToolbar } from './Toolbar';
import { getComparator, Order } from './utils';

export interface CustomCell<T> {
  id: keyof T;
  render: (row: T, key: keyof T) => React.ReactNode;
}

export interface EnhancedTableProps<T extends object> extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  data: T[];
  headCells?: HeadCell<T>[];
  deactivateSelect?: boolean;
  defaultOrderBy?: string;
  defaultOrder?: Order;
  excludedColumns?: (keyof T)[];
  customCells?: CustomCell<T>[];
  CustomToolbar?: React.FC;
  CustomSelectedToolbar?: React.FC<CustomSelectedToolbarProps<T>>;
}

interface EnhancedTableState<T> {
  order: Order;
  orderBy: keyof T;
  selected: readonly T[];
  page: number;
  rowsPerPage: number;
  searchQuery: string;
  filterFunc: (row: T) => boolean;
  filteredData: T[];
  currentData: T[];
  visibleRows: T[];
  emptyRows: number;
}

export const MUITable = React.memo(<T extends object>({
  title,
  data,
  headCells: passedHeadCells,
  deactivateSelect,
  defaultOrderBy,
  defaultOrder,
  excludedColumns,
  customCells,
  CustomToolbar,
  CustomSelectedToolbar,
  ...rest
}: EnhancedTableProps<T>) => {

  const getDefaultOrderByKey = React.useCallback((): keyof T => {
    if (data.length === 0) return "id" as keyof T;

    const keys = data.length > 0 ? (Object.keys(data[0]) as (keyof T)[]) : [];

    if (defaultOrderBy) {
      if (keys.includes(defaultOrderBy as keyof T)) {
        return defaultOrderBy as keyof T;
      } else {
        console.warn(`{defaultOrderBy}: "${defaultOrderBy}" not found among the object keys. Falling back to automatic key detection.`);
      }
    }

    return (keys.includes("id" as keyof T) ? "id" : keys[0]) as keyof T;
  }, [data, defaultOrderBy]);

  const [state, setState] = React.useState<EnhancedTableState<T>>(() => {
    const orderByKey = getDefaultOrderByKey();
    return {
      order: defaultOrder || 'asc',
      orderBy: orderByKey,
      selected: [] as readonly T[],
      page: 0,
      rowsPerPage: 5,
      searchQuery: "",
      filterFunc: () => true,
      filteredData: data,
      currentData: data,
      visibleRows: data,
      emptyRows: 0,
    };
  });

  const generateHeadCells = React.useCallback((): HeadCell<T>[] => {
    if (data.length === 0) return [];
    return Object.keys(data[0] as object)
      .filter((key) => !(excludedColumns || []).includes(key as keyof T))
      .map((key) => ({
        id: key as keyof T,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        numeric: typeof data[0][key as keyof T] === 'number',
      }));
  }, [data, excludedColumns]);

  const headCells = passedHeadCells || generateHeadCells();

  const handleSearch = (query: string) => {
    setState((prevState) => ({ ...prevState, searchQuery: query.toLowerCase() }));
  };

  React.useEffect(() => {
    const orderByKey = getDefaultOrderByKey();
    setState((prevState) => ({ ...prevState, orderBy: orderByKey }));
  }, [data, getDefaultOrderByKey]);

  // Filter data based on applied filters
  React.useEffect(() => {
    const newFilteredData = data.filter(state.filterFunc);

    setState((prevState) => ({
      ...prevState,
      filteredData: newFilteredData,
      currentData: newFilteredData,
    }));
  }, [data, state.filterFunc]);

  // Search data based on search query
  React.useEffect(() => {
    const searchResults = state.filteredData.filter((row) =>
      Object.values(row as Record<string, unknown>).some((value) =>
        typeof value === 'string' && value.toLowerCase().includes(state.searchQuery)
      )
    );
    setState((prevState) => ({ ...prevState, currentData: searchResults }));
  }, [state.filteredData, state.searchQuery]);

  // Sort and paginate data to display TablePagination and visible rows respectively
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

  // Remove selected rows deleted from the data to prevent stale selected state
  React.useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      selected: prevState.selected.filter((selectedRow) =>
        data.some((row) => row === selectedRow)
      ),
    }));
  }, [data]);


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
      setState((prevState) => ({ ...prevState, selected: [...state.currentData] }));
    } else {
      setState((prevState) => ({ ...prevState, selected: [] }));
    }
  };

  const handleClick = (_event: React.MouseEvent<unknown>, row: T) => {
    const selectedIndex = state.selected.findIndex((selectedRow) => selectedRow === row);
    let newSelected: readonly T[] = [];

    if (selectedIndex === -1) {
      newSelected = [...state.selected, row];
    } else if (selectedIndex === 0) {
      newSelected = state.selected.slice(1);
    } else if (selectedIndex === state.selected.length - 1) {
      newSelected = state.selected.slice(0, -1);
    } else if (selectedIndex > 0) {
      newSelected = [
        ...state.selected.slice(0, selectedIndex),
        ...state.selected.slice(selectedIndex + 1),
      ];
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

  const handleFilterChange = useCallback((filterFunc: (row: T) => boolean) => {
    setState((prevState) => ({ ...prevState, filterFunc }));
  }, []);

  return (
    <div {...rest}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          title={title}
          numSelected={state.selected.length}
          selected={state.selected}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          headCells={headCells}
          CustomToolbar={CustomToolbar}
          CustomSelectedToolbar={CustomSelectedToolbar}
          data={data}
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
              onSelectAllClick={deactivateSelect ? undefined : handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={state.currentData.length}
              deactivateSelectAll={deactivateSelect}
            />
            <TableBody>
              {state.visibleRows.map((row, index) => {
                const selectionKey = state.orderBy;
                const isItemSelected = state.selected.some((selectedRow) => selectedRow === row);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={deactivateSelect ? undefined : (event) => handleClick(event, row)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={String(row[selectionKey])}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    {!deactivateSelect && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                    )}
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
});
