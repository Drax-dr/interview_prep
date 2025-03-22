import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Interview from "./pages/Interview";
import Results from "./pages/Results";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/interview" element={<Interview />} />
        <Route path="/results" element={<Results />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
}

export default App;
