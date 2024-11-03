import {
  Grid,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  List,
  ListItemText,
  Collapse,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import moment from "moment";
import { TIMEZONES } from "../util/constant";
import { SelectedDetails } from "./SelectedDetails";

interface SlotFetcherProps {
  timezone: string;
  date: Dayjs | null;
  duration: number | null;
  freeSlots: string[];
  slotsFetched: boolean;
  selectedSlot: string | null;
  setSelectedSlot: (slot: string | null) => void;
  setDuration: (duration: number | null) => void;
  setTimezone: (timezone: string) => void;
  setShowCard: (value: boolean) => void;
  fetchFreeSlots: () => void;
  setDate: (date: Dayjs | null) => void;
}
export const SlotFetcher: React.FC<SlotFetcherProps> = ({
  timezone,
  duration,
  setSelectedSlot,
  date,
  setDuration,
  setTimezone,
  freeSlots,
  selectedSlot,
  slotsFetched,
  setShowCard,
  fetchFreeSlots,
  setDate,
}) => {
  const handleSlotClick = (slot: string) => {
    setSelectedSlot(slot);
  };
  const handleSelectClick = (slot: string) => {
    setSelectedSlot(slot);
    setShowCard(true);
  };
  const handleGetFreeSlotsClick = () => {
    if (!slotsFetched) {
      fetchFreeSlots();
    }
  };
  return (
    <Grid container spacing={3}>
      <Grid item xs={10} md={4}>
        <Typography variant="h6" gutterBottom>
          Selected Details
        </Typography>
        <SelectedDetails
          selectedSlot={selectedSlot}
          duration={duration}
          timezone={timezone}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography variant="h6" gutterBottom>
          Select Date and Time
        </Typography>
        <DateCalendar
          value={date ? date.toDate() : null}
          onChange={(newDate: Date | null) => {
            setDate(newDate ? dayjs(newDate) : null);
            setSelectedSlot(null);
          }}
          disablePast={true}
        />
        <Box mt={2} display="flex" flexDirection="column" alignItems="stretch">
          <TextField
            label="Duration (minutes)"
            type="number"
            value={duration || ""}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            fullWidth
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Time Zone</InputLabel>
            <Select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value as string)}
              label="Time Zone"
            >
              {TIMEZONES.map((tz) => (
                <MenuItem key={tz.value} value={tz.value}>
                  {tz.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGetFreeSlotsClick}
            fullWidth
          >
            Get Free Slots
          </Button>
        </Box>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Grid item xs={12} md={4} alignItems="center">
        <Typography variant="h6" gutterBottom>
          Free Slots
        </Typography>
        <List sx={{ maxHeight: 500, overflow: "auto" }}>
          {freeSlots.map((slot, index) => (
            <>
              {selectedSlot !== slot && (
                <Box
                  key={index}
                  onClick={() => handleSlotClick(slot)}
                  sx={{
                    marginTop: 1,
                    padding: 1,
                    marginBottom: 2,
                    border: "1px solid #ccc",
                    borderRadius: 1,
                    cursor: "pointer",
                    textAlign: "center",
                    borderColor: "#155eef",
                    color: "#155eef",
                    // margin: "0 auto",
                    maxWidth: 250,
                    "&:hover": {
                      backgroundColor: "#1976d2",
                      borderColor: "#155eef",
                      color: "#ffff",
                    },
                  }}
                >
                  <ListItemText
                    primary={moment.utc(slot).tz(timezone).format("HH:mm A")}
                  />
                </Box>
              )}
              <Box>
                <Collapse timeout={500} in={selectedSlot === slot}>
                  <Box mt={2} display="center">
                    <Button
                      variant="outlined"
                      size="large"
                      color="primary"
                      sx={{
                        borderRadius: 1,
                        backgroundColor: "#10182899",
                        borderColor: "#ffff",
                        color: "#ffff",
                        marginLeft: 1,
                      }}
                    >
                      {moment.utc(slot).tz(timezone).format("HH:mm A")}
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      color="secondary"
                      onClick={() => handleSelectClick(slot)}
                      sx={{
                        borderRadius: 1,
                        backgroundColor: "#1976d2",
                        borderColor: "#155eef",
                        color: "#ffff",
                        marginLeft: 4,
                        "&:hover": {
                          backgroundColor: "#155eef",
                        },
                      }}
                    >
                      Select
                    </Button>
                  </Box>
                </Collapse>
              </Box>
            </>
          ))}
        </List>
      </Grid>
    </Grid>
  );
};
