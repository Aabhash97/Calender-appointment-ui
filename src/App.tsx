import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BookEvent from "./components/BookEvent";
import ShowEvents from "./components/ShowEvents";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/book" Component={BookEvent} />
        <Route path="/events" Component={ShowEvents} />
      </Routes>
    </Router>
  );
};

export default App;
