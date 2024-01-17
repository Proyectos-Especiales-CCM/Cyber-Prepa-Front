interface DateCellProps {
    value: string;
}

function formatCustomDate(dateString: string) {
    const [datePart, timePart] = dateString.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.slice(0, 5).split(':');

    return `${day}/${month}/${year.slice(-2)} - ${hour}:${minute}`;
}

export default function DateCell(props: DateCellProps) {
    return <>{formatCustomDate(props.value)}</>;
}