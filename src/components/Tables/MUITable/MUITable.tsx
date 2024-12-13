import * as React from 'react';
import Box from '@mui/material/Box';
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

export interface EnhancedTableProps<T extends { id: number }> {
  info: T[];
  headCells: HeadCell<T>[];
  defaultOrderBy: keyof T;
}

export default function EnhancedTable<T extends { id: number }>({ info, headCells, defaultOrderBy }: EnhancedTableProps<T>) {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof T>(defaultOrderBy);
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [data, setData] = React.useState<T[]>(info);
  const [visibleRows, setVisibleRows] = React.useState<T[]>([]);
  const [emptyRows, setEmptyRows] = React.useState(0);

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  // Updates data when search query changes
  React.useEffect(() => {
    const filteredData = info.filter((row: T) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchQuery)
      )
    );
    setData(filteredData);
  }, [info, searchQuery]);

  // Calculate visible rows and empty rows when relevant data changes
  React.useEffect(() => {
    const sortedData = [...data].sort(getComparator<T, keyof T>(order, orderBy));
    const paginatedData = sortedData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
    setVisibleRows(paginatedData);

    const calculatedEmptyRows = Math.max(0, (1 + page) * rowsPerPage - data.length);
    setEmptyRows(calculatedEmptyRows);
  }, [data, order, orderBy, page, rowsPerPage]);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof T,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} selected={selected} onSearch={handleSearch} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="small"
          >
            <EnhancedTableHead
              headCells={headCells}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = selected.includes(row.id);
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
                    {/* Checkbox Cell */}
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>

                    {/* Dynamically Rendered Cells */}
                    {headCells.map((headCell, cellIndex) => (
                      <TableCell
                        key={String(headCell.id)}
                        component={cellIndex === 0 ? "th" : undefined}
                        id={cellIndex === 0 ? labelId : undefined}
                        scope={cellIndex === 0 ? "row" : undefined}
                        align={cellIndex === 0 ? "left" : "right"}
                        padding={cellIndex === 0 ? "none" : "normal"}
                      >
                        {String(row[headCell.id])}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
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
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
