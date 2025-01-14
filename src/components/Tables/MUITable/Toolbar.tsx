import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, Checkbox, IconButton, InputBase, Popover, Slider, Stack, Toolbar, Tooltip, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";
import { HeadCell } from "./TableHead";

interface Filter {
  key: string;
  type: "number" | "string" | "boolean";
  value?: string | boolean | number[];
}

interface FilterConfig {
  key: string;
  type: "number" | "string" | "boolean";
  min?: number;
  max?: number;
}

export interface CustomSelectedToolbarProps<T> {
  selected?: readonly T[];
  data?: T[];
}

interface EnhancedTableToolbarProps<T> {
  title: string;
  numSelected: number;
  selected: readonly T[];
  onFilterChange: (filterFunc: (row: T) => boolean) => void;
  onSearch: (query: string) => void;
  headCells: HeadCell<T>[];
  CustomToolbar?: React.FC;
  CustomSelectedToolbar?: React.FC<CustomSelectedToolbarProps<T>>;
  data?: T[];
}

export function EnhancedTableToolbar<T>(props: EnhancedTableToolbarProps<T>) {
  const { title, numSelected, selected, onFilterChange, onSearch, headCells, CustomToolbar, CustomSelectedToolbar, data } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [filterConfig, setFilterConfig] = useState<FilterConfig[]>([]);
  // rest value to force re-render of filters
  const [resetCounter, setResetCounter] = useState(0);

  useEffect(() => {
    if (data && data.length > 0) {
      const inferredConfig = Object.keys(data[0] as object).map((key: string) => {
        const values = data.map((row) => (row as Record<string, any>)[key]);
        const isNumber = values.every((val) => typeof val === "number");
        const inferredType = isNumber ? "number" : typeof values[0] === "boolean" ? "boolean" : "string";
        return {
          key,
          type: inferredType as "number" | "string" | "boolean",
          min: isNumber ? Math.min(...values) : undefined,
          max: isNumber ? Math.max(...values) : undefined,
        };
      });
      setFilterConfig(inferredConfig);
    }
  }, [data]);

  useEffect(() => {
    const newFilterFunc = (row: T) => {
      if (filters.length === 0) return true;
      return filters.every((filter) => {
        const rowValue = (row as Record<string, any>)[filter.key];
        if (filter.type === "number") {
          const [min, max] = filter.value as number[];
          return rowValue >= min && rowValue <= max;
        }
        if (filter.type === "string") {
          return rowValue.toString().toLowerCase().includes((filter.value as string).toLowerCase());
        }
        if (filter.type === "boolean") {
          return rowValue === filter.value;
        }
        return true;
      });
    };
    onFilterChange(newFilterFunc);
  }, [filters, onFilterChange]);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const getFilter = (key: string): Filter | undefined =>
    filters.find((filter) => filter.key === key);

  const updateFilter = (updatedFilter: Filter) => {
    setFilters((prevFilters) => {
      const existingIndex = prevFilters.findIndex((filter) => filter.key === updatedFilter.key);
      if (existingIndex !== -1) {
        // Update existing filter
        const newFilters = [...prevFilters];
        newFilters[existingIndex] = updatedFilter;
        return newFilters;
      }
      // Add new filter
      return [...prevFilters, updatedFilter];
    });
  };

  const removeFilter = (key: string) => {
    setFilters((prevFilters) => prevFilters.filter((filter) => filter.key !== key));
  };

  const handleFilterChange = (key: string, value: any) => {
    if (value === undefined || value === null || value === "") {
      removeFilter(key);
    } else {
      const config = filterConfig.find((config) => config.key === key);
      if (!config) return;

      updateFilter({
        key,
        type: config.type,
        value,
      });
    }
  };

  const resetFilters = () => {
    setFilters([]);
    setResetCounter((prev) => prev + 1);
  };

  return (
    <Toolbar
      sx={[
        { pl: { sm: 2 }, pr: { sm: 1 } },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <>
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
          {CustomSelectedToolbar && (
            <CustomSelectedToolbar data={data} selected={selected} />
          )}
        </>
      ) : (
        <Stack
          direction="row"
          justifyContent="space-between"
          width="100%"
          alignItems="center"
        >
          <Typography
            sx={{ flex: "1 1 100%", alignContent: "center", paddingLeft: 1 }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            {title}
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              border: 1,
              borderColor: "lightgray",
              borderRadius: 1,
            }}
          >
            <InputBase
              placeholder="Search…"
              onChange={(e) => onSearch(e.target.value)}
              sx={{ marginLeft: 2, flex: 1, width: 180 }}
            />
            <IconButton>
              <SearchIcon />
            </IconButton>
          </Box>
          <Tooltip title="Filter list">
            <IconButton onClick={handleOpen}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          {CustomToolbar && <CustomToolbar />}
        </Stack>
      )}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: { sx: { width: "20%", padding: 2, boxShadow: 2 } }
        }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Filters
          </Typography>
          <Button variant="contained" size="small" sx={{ height: "fit-content" }} onClick={resetFilters}>
            Reset
          </Button>
        </Stack>
        <Stack key={resetCounter} spacing={2}>
          {filterConfig.map(({ key, type, min, max }) => {
            const currentFilter = getFilter(key);
            return (
              <Box key={key}>
                <Typography variant="subtitle1">
                  {headCells.find((cell) => cell.id === key)?.label}
                </Typography>
                {type === "number" && min !== undefined && max !== undefined && (
                  <Slider
                    value={[
                      (currentFilter?.value as number[] | undefined)?.[0] ?? min,
                      (currentFilter?.value as number[] | undefined)?.[1] ?? max,
                    ]}
                    onChange={(_, newValue) => {
                      const [newMin, newMax] = newValue as number[];
                      handleFilterChange(key, [newMin, newMax]);
                    }}
                    valueLabelDisplay="auto"
                    min={min || 0}
                    max={max || 100}
                    step={1}
                  />
                )}
                {type === "string" && (
                  <InputBase
                    placeholder="Search..."
                    value={(currentFilter?.value as string) || ""}
                    onChange={(e) => handleFilterChange(key, e.target.value)}
                    sx={{
                      padding: 1,
                      border: 1,
                      borderColor: "lightgray",
                      borderRadius: 1,
                      width: "100%",
                    }}
                  />
                )}
                {type === "boolean" && (
                  <Box display="flex" alignItems="center">
                    <Checkbox
                      checked={currentFilter?.value === true}
                      onChange={(e) =>
                        handleFilterChange(key, e.target.checked)
                      }
                    />
                    {currentFilter && (
                      <Close
                        color="error"
                        sx={{ cursor: "pointer", fontSize: 15 }}
                        onClick={() => handleFilterChange(key, undefined)}
                      />
                    )}
                  </Box>
                )}
              </Box>
            );
          })}
        </Stack>
      </Popover>
    </Toolbar>
  );
}
