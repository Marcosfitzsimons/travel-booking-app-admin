import moment from "moment";

const convertToDatePickerFormat = (date: string) => {
    const momentDate = moment.utc(date);
    const selectedDate = momentDate.toDate();
    return selectedDate;
  };

  export {
    convertToDatePickerFormat
  }