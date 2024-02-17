import { completeImageUrl } from "../../../../services";
interface ImageCellProps {
    value: string | undefined;
    style?: React.CSSProperties;
}
  
export default function ImageCell(props: ImageCellProps) {
    let url = completeImageUrl(props.value);
    if (!url) url = '';
    return <img src={url} alt="Image" style={props.style} />;
}