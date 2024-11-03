import { useCallback, useEffect, useState } from "react";
import { Box, Typography, debounce } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import moment from "moment";
import { BASE_URL } from "../util/constant";
import { EventScheduler } from "./EventScheduler";
import { SlotFetcher } from "./SlotFetcher";

const BookEvent = () => {
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [duration, setDuration] = useState<number | null>(null);
  const [timezone, setTimezone] = useState<string>("");
  const [freeSlots, setFreeSlots] = useState<string[]>([]);
  const [slotsFetched, setSlotsFetched] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showCard, setShowCard] = useState<boolean>(false);

  const fetchFreeSlots = async () => {
    if (date && duration && timezone) {
      const response = await axios.get(`${BASE_URL}/api/free-slots`, {
        params: {
          date: moment(date.toDate()).format("YYYY-MM-DD"),
          duration: duration,
          timezone: timezone,
        },
      });
      const sortedSlots = response.data.data.sort((a: string, b: string) => {
        const momentA = moment.tz(a, timezone);
        const momentB = moment.tz(b, timezone);

        const isAM_A = momentA.format("A") === "AM";
        const isAM_B = momentB.format("A") === "AM";

        if (isAM_A && !isAM_B) return -1;
        if (!isAM_A && isAM_B) return 1;

        return momentA.diff(momentB);
      });
      setFreeSlots(sortedSlots);
      setSlotsFetched(true);
    }
  };

  const debouncedFetchFreeSlots = useCallback(debounce(fetchFreeSlots, 300), [
    fetchFreeSlots,
  ]);

  useEffect(() => {
    if (slotsFetched) {
      debouncedFetchFreeSlots();
    }
    // Cleanup the debounce on unmount
    return () => {
      debouncedFetchFreeSlots.clear();
    };
  }, [timezone, date]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ToastContainer />
      <Box
        className="card"
        p={5}
        boxShadow={3}
        borderRadius={2}
        maxWidth={1000}
        mx="auto"
        marginTop={"50px"}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "#3f51b5",
            textAlign: "left",
            marginBottom: "20px",
          }}
        >
          Book Event
        </Typography>
        {!showCard && (
          <SlotFetcher
            timezone={timezone}
            duration={duration}
            freeSlots={freeSlots}
            slotsFetched={slotsFetched}
            date={date}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            setDuration={setDuration}
            setTimezone={setTimezone}
            setShowCard={setShowCard}
            fetchFreeSlots={fetchFreeSlots}
            setDate={setDate}
          />
        )}
        {showCard && (
          <EventScheduler
            timezone={timezone}
            duration={duration}
            selectedSlot={selectedSlot}
            setShowCard={setShowCard}
            setSelectedSlot={setSelectedSlot}
            fetchFreeSlots={fetchFreeSlots}
          />
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default BookEvent;
