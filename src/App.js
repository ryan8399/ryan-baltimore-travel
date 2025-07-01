import React, { useState } from "react";
import {
  format,
  addMonths,
  startOfToday,
  differenceInCalendarDays,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

// Dates for Ryan to Pre-Enter

// Preselected Dates: e.g., Jul 1–2 and Jul 10-11
const PRESELECTED_DATES = [
  new Date(2025, 6, 1), // Jul 1
  new Date(2025, 6, 2),
  new Date(2025, 6, 10),
  new Date(2025, 6, 11),  // Jul 11
];

const UNAVAILABLE_DATES = [
  new Date(2025, 6, 3), // July 3
  new Date(2025, 10, 3), 
  new Date(2025, 10, 4),
  new Date(2025, 10, 5), 
  new Date(2025, 10, 6),
  new Date(2025, 10, 7), 
  new Date(2025, 10, 8),
  new Date(2025, 10, 9), 
  new Date(2025, 10, 10),
  new Date(2025, 10, 11), 
  new Date(2025, 10, 12),
  new Date(2025, 10, 13), 
  new Date(2025, 10, 14),
  new Date(2025, 10, 15), 
  new Date(2025, 10, 16),
  new Date(2025, 10, 17), 
  new Date(2025, 10, 18),
  new Date(2025, 10, 19), 
  new Date(2025, 10, 20),
  new Date(2025, 10, 21), 
  new Date(2025, 10, 22),
  new Date(2025, 10, 23), 
  new Date(2025, 10, 24),
  new Date(2025, 10, 25), 
  new Date(2025, 10, 26),
  new Date(2025, 10, 27), 
  new Date(2025, 10, 28),
  new Date(2025, 10, 29), 
  new Date(2025, 10, 30),
  new Date(2025, 11, 1), 
  new Date(2025, 11, 2),
  new Date(2025, 11, 3), 
  new Date(2025, 11, 4),
  new Date(2025, 11, 5), 
  new Date(2025, 11, 6),
  new Date(2025, 11, 7), 
  new Date(2025, 11, 8),
  new Date(2025, 11, 9), 
  new Date(2025, 11, 10),
  new Date(2025, 11, 11), 
  new Date(2025, 11, 12),
  new Date(2025, 11, 13), 
  new Date(2025, 11, 14),
  new Date(2025, 11, 15), 
  new Date(2025, 11, 16),
  new Date(2025, 11, 17), 
  new Date(2025, 11, 18),
  new Date(2025, 11, 19), 
  new Date(2025, 11, 20),
  new Date(2025, 11, 21), 
  new Date(2025, 11, 22),
  new Date(2025, 11, 23), 
  new Date(2025, 11, 24),
  new Date(2025, 11, 25), 
  new Date(2025, 11, 26),
  new Date(2025, 11, 27), 
  new Date(2025, 11, 28),
  new Date(2025, 11, 29), 
  new Date(2025, 11, 30),
];

const PASSKEY = "khalas";

const App = () => {
  const [authorized, setAuthorized] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [availableDates, setAvailableDates] = useState(PRESELECTED_DATES);
  const [error, setError] = useState(null);
  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const backgroundStyle = {
    backgroundImage:
      "url('https://www.thespruceeats.com/thmb/KlsigrSz_lIN8bxtVPCRY-fTXVM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/easy-beginner-kibbeh-recipe-2355367-hero-01-931e79e7e5be42f6bad05ac61f018b42.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    backgroundRepeat: "no-repeat",
  };

  const handleLogin = () => {
    if (inputKey === PASSKEY) {
      setAuthorized(true);
      setError(null);
    } else {
      setError("Invalid passkey.");
    }
  };

  const addAvailability = () => {
    const days = eachDayOfInterval({
      start: range.startDate,
      end: range.endDate,
    });

    const newDates = days.filter(
  (d) =>
    !availableDates.some((ad) => isSameDay(ad, d)) &&
    !UNAVAILABLE_DATES.some((ud) => isSameDay(ud, d))
);

    const totalDates = [...availableDates, ...newDates];

    if (totalDates.length > 60) {
      setError("Exceeds 60 available days.");
      return;
    }

    const segments = getConsecutiveSegments(totalDates);
    if (segments.length > 12) {
      setError("Exceeds 12 segments of consecutive days.");
      return;
    }

    setAvailableDates(totalDates);
    setError(null);
  };



  const getConsecutiveSegments = (dates) => {
    const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
    const segments = [];
    let currentSegment = [];

    for (let i = 0; i < sorted.length; i++) {
      if (currentSegment.length === 0) {
        currentSegment.push(sorted[i]);
      } else {
        const prev = currentSegment[currentSegment.length - 1];
        if (differenceInCalendarDays(sorted[i], prev) === 1) {
          currentSegment.push(sorted[i]);
        } else {
          segments.push(currentSegment);
          currentSegment = [sorted[i]];
        }
      }
    }



    if (currentSegment.length) segments.push(currentSegment);
    return segments;
  };

  const clearAvailability = () => {
    setAvailableDates(PRESELECTED_DATES);
    setError(null);
  };

// Add this function inside App component, before the return statement:
const tileClassName = ({ date, view }) => {
  if (view === "month") {
    if (availableDates.some((d) => isSameDay(d, date))) {
      return "highlight-selected-date";
    }
  }
  return null;
};


  if (!authorized) {
    return (
      <div
        style={backgroundStyle}
        className="min-h-screen flex flex-col items-center justify-center p-4"
      >
        <div className="p-6 max-w-sm w-full border rounded shadow bg-white bg-opacity-80">
          <h2 className="text-xl font-bold mb-4">Enter Access Passkey</h2>
          <input
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            className="border p-2 rounded w-full mb-4"
            placeholder="Passkey"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            Enter
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={backgroundStyle} className="p-4 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-white drop-shadow-md" style={{color: "#ff4db8",
    textShadow: "1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000",}}>
        Ryan's Days in Baltimore (Max 60 days, 12 ranges)
      </h1>
      <div className="mb-4 rounded bg-white bg-opacity-90 p-4 shadow">
        <DateRange
          editableDateInputs={true}
          onChange={(item) => setRange(item.selection)}
          moveRangeOnFirstSelection={false}
          ranges={[range]}
          minDate={startOfToday()}
          maxDate={addMonths(new Date(), 12)}
	  disabledDates={UNAVAILABLE_DATES}
        />
      </div>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded mr-2"
        onClick={addAvailability}
      >
        Add Selected Range
      </button>
      <button
        className="bg-red-600 text-white px-4 py-2 rounded"
        onClick={clearAvailability}
      >
        Clear All
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="mt-6 rounded bg-white bg-opacity-90 p-4 shadow" style={{color: "#ff99d6",
    textShadow: "1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000",}}>
        <h2 className="text-xl font-semibold mb-2">
          Selected Ranges ({availableDates.length} days in{" "}
          {getConsecutiveSegments(availableDates).length} ranges)
        </h2>
        <ul className="space-y-2">
          {getConsecutiveSegments(availableDates).map((segment, idx) => (
            <li key={idx} className="bg-green-100 p-2 rounded" style={{color: "#ff99d6",
    textShadow: "1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000",}}>
              {format(segment[0], "MMM d, yyyy")} –{" "}
              {format(segment[segment.length - 1], "MMM d, yyyy")}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

<div className="mt-6 rounded bg-white bg-opacity-90 p-4 shadow" style={{ color: "#ff99d6", textShadow: "1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000" }}>
  <h2 className="text-xl font-semibold mb-2">Unavailable Days</h2>
  <ul className="space-y-2">
    {UNAVAILABLE_DATES.map((date, idx) => (
      <li key={idx} className="bg-red-100 p-2 rounded">
        {format(date, "MMM d, yyyy")}
      </li>
    ))}
  </ul>
</div>


export default App;