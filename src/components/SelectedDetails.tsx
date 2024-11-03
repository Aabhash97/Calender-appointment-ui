import { Typography, Box } from "@mui/material";
import TimerIcon from "@mui/icons-material/Timer";
import LanguageIcon from "@mui/icons-material/Language";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import moment from "moment";

interface SelectedDetailsProps {
  selectedSlot: string | null;
  duration: number | null;
  timezone: string;
}

export const SelectedDetails: React.FC<SelectedDetailsProps> = ({
  selectedSlot,
  duration,
  timezone,
}) => {
  return (
    <><Box display="flex" alignItems="center" mb={1}>
          <LanguageIcon />
          <Typography variant="body1" ml={1}>
              {timezone}
          </Typography>
      </Box><Box display="flex" alignItems="center" mb={1}>
              <CalendarMonthIcon />
              <Typography variant="body1" ml={1}>
                  {selectedSlot
                      ? moment
                          .utc(selectedSlot)
                          .tz(timezone)
                          .format("MMMM D, YYYY HH:mm A")
                      : ""}
              </Typography>
          </Box><Box display="flex" alignItems="center" mb={1}>
              <TimerIcon />
              <Typography variant="body1" ml={1}>
                  {duration ? `${duration} minutes` : ""}
              </Typography>
          </Box></>
  );
};
