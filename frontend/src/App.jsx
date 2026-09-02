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
import Tasks from "./pages/Tasks";
import TaskDetail from "./pages/TaskDetail";
import Issues from "./pages/Issues";
import IssueDetail from "./pages/IssueDetail";
import Completed from "./pages/Completed";
import Inbox from "./pages/Inbox";
import ProjectMembers from "./pages/ProjectMembers";
import Settings from "./pages/Settings";
import MyTeam from "./pages/MyTeam";

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
          <Route
            path="/inbox"
            element={<Inbox />}
          />
          <Route
            path="/team"
            element={<MyTeam />}
          />
          <Route
            path="/settings"
            element={<Settings />}
          />
          <Route
            path="/workspace/:workspaceId/projects"
            element={<Projects />}
          />
          <Route
            path="/projects/:projectId"
            element={<ProjectDetail />}
          />
          <Route
            path="/projects/:projectId/members"
            element={<ProjectMembers />}
          />
          <Route
            path="/projects/:projectId/tasks"
            element={<Tasks />}
          />
          <Route
            path="/workspace/:workspaceId/tasks"
            element={<Tasks />}
          />
          <Route
            path="/tasks/:id"
            element={<TaskDetail />}
          />
          <Route
            path="/projects/:projectId/issues"
            element={<Issues />}
          />
          <Route
            path="/workspace/:workspaceId/issues"
            element={<Issues />}
          />
          <Route
            path="/issues/:id"
            element={<IssueDetail />}
          />
          <Route
            path="/workspace/:workspaceId/completed"
            element={<Completed />}
          />
          <Route
            path="*"
            element={<Navigate to="/dashboard" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


export default App;
