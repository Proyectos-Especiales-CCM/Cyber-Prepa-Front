interface ImageCellProps {
    value: string;
    style?: React.CSSProperties;
}
  
export default function ImageCell(props: ImageCellProps) {
    const url = props.value ? `${import.meta.env.VITE_API_BASE_URL}${props.value.slice(1)}` : undefined;
    return <img src={url} alt="Image" style={props.style} />;
}