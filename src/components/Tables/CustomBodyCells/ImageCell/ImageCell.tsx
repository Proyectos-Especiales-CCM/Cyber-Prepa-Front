interface ImageCellProps {
    value: string;
}

export default function ImageCell(props: ImageCellProps) {
    const url = `${import.meta.env.VITE_API_BASE_URL}${props.value.slice(1)}`;
    return <img src={url} alt="Image" style={{ width: '50px', height: 'auto' }} />;
}