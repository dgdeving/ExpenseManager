import { parse } from 'date-fns';

const parseDate = (dateString) => {
    const formats = ["dd/MM/yyyy", "yyyy.MM.dd"];  // List of expected formats
    for (const format of formats) {
        const parsedDate = parse(dateString, format, new Date());
        if (!isNaN(parsedDate)) return parsedDate;  // Check if parsedDate is a valid date
    }
    return new Date();  // Return current date as fallback
};

export default parseDate;