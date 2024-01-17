import { CheckCircleOutline, HighlightOff } from "@mui/icons-material";

interface BooleanCellProps {
  value: boolean;
}

export default function BooleanCell(props: BooleanCellProps) {
  return <>{props.value ? <CheckCircleOutline color="success" /> : <HighlightOff color="error" />}</>;
}
