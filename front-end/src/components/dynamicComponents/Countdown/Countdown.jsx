import { useEffect, useState } from "react";

const Countdown = ({ createdAt, duration }) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Parse the createdAt time and add the duration to get the target time
    const createdDate = new Date(createdAt);
    const targetDate = new Date(
      createdDate.getTime() + duration * 24 * 60 * 60 * 1000
    );

    const updateCountdown = () => {
      const currentTime = new Date();
      const timeDifference = targetDate - currentTime;

      if (timeDifference <= 0) {
        setMessage("Time has elapsed!");
      } else {
        // Calculate days, hours, minutes, and seconds left
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        setMessage(`Time left: ${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    };

    // Update countdown every second
    const intervalId = setInterval(updateCountdown, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [createdAt, duration]);

  return <div>{message}</div>;
};

export default Countdown;
