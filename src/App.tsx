import Apply from "./components/apply";
import Login from "./components/auth/login";
import Register from "./components/auth/register";

import Header from "./components/header";
import Home from "./components/home/index";

import "./App.css";

import AuthContextProvider from "./contexts/authContext/index";
import { useRoutes } from "react-router-dom";
import Applications from "./components/applications";
import Competitions from "./components/competitions";
import FAQ from "./components/FAQ";

function App() {
  const routesArray = [
    {
      path: "*",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/apply",
      element: <Apply />,
    },
    {
      path: "/applications",
      element: <Applications />,
    },
    {
      path: "/competitions",
      element: <Competitions />,
    },
    {
      path: "/faq",
      element: <FAQ />,
    },
  ];
  let routesElement = useRoutes(routesArray);
  return (
    <AuthContextProvider>
      <Header />
      <div className="w-full h-screen flex flex-col">{routesElement}</div>
    </AuthContextProvider>
  );
}

export default App;
