import {
  Grid,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { BASE_URL } from "../util/constant";
import axios from "axios";
import { SelectedDetails } from "./SelectedDetails";
interface EventSchedulerProps {
  timezone: string;
  duration: number | null;
  selectedSlot: string | null;
  fetchFreeSlots: () => void;
  setShowCard: (value: boolean) => void;
  setSelectedSlot: (value: string) => void;
}
export const EventScheduler: React.FC<EventSchedulerProps> = ({
  timezone,
  duration,
  selectedSlot,
  fetchFreeSlots,
  setShowCard,
  setSelectedSlot,
}) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [additionalInfo, setAdditionalInfo] = useState<string>("");
  const [consent, setConsent] = useState<boolean>(false);

  const handleScheduleMeeting = async () => {
    if (!firstName || !email || !lastName) {
      toast.error("Name and Email are required fields.");
      return;
    }
    if (selectedSlot) {
      await createEvent(selectedSlot);
    } else {
      toast.error("Please select a slot to schedule the meeting");
    }
  };

  const createEvent = async (slot: string) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/book`, {
        dateTime: slot,
        duration: duration,
        timeZone: timezone,
      });
      if (res.status === 200) {
        handleBackClick();
        toast.success("Event booked successfully!");
        console.log(`Event created for slot: ${slot}`);
        fetchFreeSlots();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        handleBackClick();
        toast.error("Event already booked for this slot");
      } else {
        handleBackClick();
        console.error("Error booking event:", error);
        toast.error("Error booking event");
      }
    }
  };
  const handleBackClick = () => {
    setShowCard(false);
    setLastName("");
    setFirstName("");
    setEmail("");
    setPhone("");
    setAdditionalInfo("");
    setConsent(false);
    setSelectedSlot("");
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <SelectedDetails
          selectedSlot={selectedSlot}
          duration={duration}
          timezone={timezone}
        />
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography variant="h6">Enter Details</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="First Name"
              fullWidth
              margin="normal"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Last Name"
              fullWidth
              margin="normal"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Phone Number"
              fullWidth
              margin="normal"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              helperText="Format: 123-456-7890"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Additional Information"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
            />
          </Grid>
        </Grid>
        <FormControlLabel
          control={
            <Checkbox
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
          }
          label="I confirm that I want to receive content from this company using any contact information I provide."
        />
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleBackClick}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleScheduleMeeting}
          >
            Schedule Meeting
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};
