import React, { useCallback, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Header from "./Header";
import Questions from "./Questions";
import { useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import QuestionForm from "./QuestionForm";
import QuestionPage from "./QuestionPage";
import Footer from "./Footer";
import MyBadges from "./MyBadges";

function App() {
  const { currentUser } = useAuth();

  const getGuestRoutes = useCallback(() => {
    if (currentUser) {
      return null;
    }

    return [
      <Route key="signupRoute" path="/signup" element={<Signup />} />,
      <Route key="loginRoute" path="/login" element={<Login />} />,
    ];
  }, [currentUser]);

  return (
    <Router>
      <Header />
      <Routes>
        {getGuestRoutes()}
        <Route path="/" element={<Questions />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/question/:questionId" element={<QuestionPage />} />
        <Route path="/question/edit/:questionId" element={<QuestionForm />} />
        <Route
          path="/new-question"
          element={
            <ProtectedRoute>
              <QuestionForm />
            </ProtectedRoute>
          }
        />
        <Route
        path="/badges"
        element={
          <ProtectedRoute>
            <MyBadges />
          </ProtectedRoute>
        }
      />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
