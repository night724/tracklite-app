import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./layouts/AppLayout";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
        </Route>
        <Route
          path="/projects"
          element={<Projects />}
        />
        <Route
          path="/projects/:id"
          element={<ProjectDetail />}
        />
        <Route
          path="*"
          element={<Navigate to="/dashboard" />}
        />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
