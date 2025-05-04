import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../server";

const CountDown = ({ data }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // If countdown is over, delete event
    if (
      typeof timeLeft.days === "undefined" &&
      typeof timeLeft.hours === "undefined" &&
      typeof timeLeft.minutes === "undefined" &&
      typeof timeLeft.seconds === "undefined"
    ) {
      const token = localStorage.getItem("token"); // Get token from local storage

      axios
        .delete(`${server}/event/delete-shop-event/${data._id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header
          },
        })
        .then(() => {
          console.log("Event deleted successfully");
        })
        .catch((err) => {
          console.error("Delete failed:", err);
        });
    }

    return () => clearTimeout(timer); // Correctly clean up the timeout
  }, [timeLeft]); // Run effect whenever timeLeft changes

  function calculateTimeLeft() {
    const difference = +new Date(data.Finish_Date) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval]) return null;

    return (
      <span key={interval} className="text-[25px] text-[#475ad2]">
        {timeLeft[interval]} {interval}{" "}
      </span>
    );
  });

  return (
    <div>
      {timerComponents.length ? (
        timerComponents
      ) : (
        <span className="text-[#9b1b1b] text-[25px]">Event is over.</span>
      )}
    </div>
  );
};

export default CountDown;
