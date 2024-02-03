
export const formatTime = (dateString) => {
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
      timeZone: 'Europe/Istanbul', // Set the desired time zone
    };
  
    const formattedTime = new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
    return formattedTime;
  };
  
  export const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
    return formattedDate;
  };
  