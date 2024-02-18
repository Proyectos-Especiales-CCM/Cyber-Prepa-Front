/**
 * Interface for the props of the DateCell component.
 * 
 * @interface
 * @property {string} value - The date string to be formatted and displayed.
 */
interface DateCellProps {
    value: string;
}

/**
 * Formats a date string from the ISO 8601 format to a custom format.
 * 
 * @param {string} dateString - The date string in ISO 8601 format.
 * @returns {string} The formatted date string, or an empty string if the input is falsy.
 */
function formatCustomDate(dateString: string) {
    if (!dateString) return '';
    const [datePart, timePart] = dateString.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.slice(0, 5).split(':');

    return `${day}/${month}/${year.slice(-2)} - ${hour}:${minute}`;
}

/**
 * A React component that displays a date string in a custom format (DD/MM/YY - hh:mm).
 * 
 * @component
 * @param {DateCellProps} props - The props of the component.
 * @returns {JSX.Element} A JSX element containing the formatted date string.
 */
export default function DateCell(props: DateCellProps) {
    return <>{formatCustomDate(props.value)}</>;
}