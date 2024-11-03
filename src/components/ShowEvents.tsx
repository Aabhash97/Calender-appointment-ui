import React, { useState } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import {
  Container,
  Typography,
  Button,
  Grid,
  TextField,
  Paper,
  List,
  ListItem,
  Box,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import momentTimezone from "moment-timezone";
import "../ShowEvents.css";
import { BASE_URL, TIMEZONES_VALUE } from "../util/constant";

const ShowEvents: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [events, setEvents] = useState<
    { dateTime: string; duration: string }[]
  >([]);
  const [timeZone, setTimeZone] = useState<string>("America/New_York");

  const fetchEvents = async () => {
    if (startDate && endDate) {
      const response = await axios.get(`${BASE_URL}/api/events`, {
        params: {
          startDate: moment(startDate).format("YYYY-MM-DD"),
          endDate: moment(endDate).format("YYYY-MM-DD"),
        },
      });

      setEvents(response.data);
    }
  };

  return (
    <Container maxWidth="lg">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Event Scheduler</Typography>
        </Toolbar>
      </AppBar>
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Show Events
        </Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              customInput={<TextField label="Start Date" variant="outlined" />}
            />
          </Grid>
          <Grid item>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              customInput={<TextField label="End Date" variant="outlined" />}
            />
          </Grid>
          <Grid item>
            <FormControl variant="outlined">
              <InputLabel>Time Zone</InputLabel>
              <Select
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value as string)}
                label="Time Zone"
              >
                {TIMEZONES_VALUE.map((tz) => (
                  <MenuItem key={tz} value={tz}>
                    {tz}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={fetchEvents}>
              Show Events
            </Button>
          </Grid>
        </Grid>
        <Paper
          style={{
            marginTop: 20,
            padding: 20,
            maxHeight: 600,
            overflowY: "auto",
          }}
        >
          {events.length === 0 ? (
            <Card style={{ width: "100%" }}>
              <CardContent
                sx={{
                  padding: 2,
                  margin: 1,
                  backgroundColor: "#f5f5f5",
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              >
                <Typography variant="h6">No scheduled appointments</Typography>
              </CardContent>
            </Card>
          ) : (
            <TransitionGroup component={List}>
              {events.map((event, index) => {
                const startTime = momentTimezone(event.dateTime).tz(timeZone);
                const endTime = startTime
                  .clone()
                  .add(parseInt(event.duration, 10), "minutes");
                return (
                  <CSSTransition key={index} timeout={500} classNames="fade">
                    <ListItem>
                      <Card style={{ width: "100%" }}>
                        <CardContent
                          sx={{
                            padding: 2,
                            margin: 1,
                            backgroundColor: "#f5f5f5",
                            borderRadius: 2,
                            boxShadow: 1,
                          }}
                        >
                          <Typography variant="h6">
                            Time Slot:{" "}
                            {startTime.format("MMMM Do YYYY, h:mm A z")} -{" "}
                            {endTime.format("h:mm A z")}
                          </Typography>
                          <Typography variant="body2">
                            Duration: {event.duration} mins
                          </Typography>
                        </CardContent>
                      </Card>
                    </ListItem>
                  </CSSTransition>
                );
              })}
            </TransitionGroup>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ShowEvents;
