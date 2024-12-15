import { alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Box, InputBase, Stack } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";

export interface CustomSelectedToolbarProps {
  selected?: readonly number[];
  data?: unknown[];
}

interface EnhancedTableToolbarProps {
  title: string;
  numSelected: number;
  selected: readonly number[];
  onSearch: (query: string) => void;
  CustomSelectedToolbar?: React.FC<CustomSelectedToolbarProps>;
  data?: unknown[];
}

export function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { title, numSelected, selected, onSearch, CustomSelectedToolbar, data } = props;

  const handleDelete = () => {
    console.log("Deleting rows with IDs:", selected);
  };

  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <>
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
          {CustomSelectedToolbar && <CustomSelectedToolbar data={data} selected={selected} />}
          <Tooltip title="Delete">
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Stack direction="row" justifyContent="space-between" width={"100%"}>
          <Typography
            sx={{ flex: '1 1 100%', alignContent: "center", paddingLeft: 1 }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            {title}
          </Typography>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", border: 1, borderColor: "lightgray", borderRadius: 1 }}>
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
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
    </Toolbar>
  );
}
