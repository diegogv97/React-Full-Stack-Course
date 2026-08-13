const Notification = ({ notification }) => {
  if (notification === null) {
    return null;
  }

  const { message, type } = notification;

  if (type === "success") {
    return <div className="notification success">{message}</div>;
  }

  if (type === "error") {
    return <div className="notification error">{message}</div>;
  }
};

export default Notification;
