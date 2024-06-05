import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { useAppSelector } from "store";

import CenterLoading from "components/Common/CenterLoading";
import AuthenticatedLayout from "components/Common/Layout/AuthenticatedLayout";
import UnauthenticatedLayout from "components/Common/Layout/UnauthenticatedLayout";
import AllBooks from "components/Unauthenticated/AllBooks";
import BooksByAuthor from "components/Unauthenticated/BooksByAuthor";
import BooksByCategory from "components/Unauthenticated/BooksByCategory";
import Login from "components/Unauthenticated/Login";
import Signup from "components/Unauthenticated/Signup";

import Cart from "components/Authenticated/Cart";
import Checkout from "components/Authenticated/Checkout";
import OrderDetail from "components/Authenticated/OrderDetail";
import OrderList from "components/Authenticated/OrderList";
import AboutUs from "components/Unauthenticated/AboutUs";
import BookDetail from "components/Unauthenticated/BookDetail";
import Home from "components/Unauthenticated/Home";
import { useLazyGetProfileQuery } from "store/api/user/userApiSlice";
import { selectIsLoggedIn } from "store/slice/userSlice";
import "./App.css";

const sharedRoutes = [
  {
    index: true,
    element: <Home />,
  },
  {
    path: "shop",
    children: [
      {
        index: true,
        element: <AllBooks />,
      },
      {
        path: "author/:slug",
        element: <BooksByAuthor />,
      },
      {
        path: "category/:slug",
        element: <BooksByCategory />,
      },
      {
        path: "book/:slug",
        element: <BookDetail />,
      },
    ],
  },
  {
    path: "about",
    element: <AboutUs />,
  },
];

const publicRoutes = createBrowserRouter([
  {
    path: "/",
    element: <UnauthenticatedLayout />,
    children: [
      ...sharedRoutes,
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to={`/`} />,
  },
]);

const protectedRoutes = createBrowserRouter([
  {
    path: "/",
    element: <AuthenticatedLayout />,
    children: [
      ...sharedRoutes,
      {
        path: "cart",
        children: [
          {
            index: true,
            element: <Cart />,
          },
          {
            path: "checkout",
            element: <Checkout />,
          },
        ],
      },
      {
        path: "order",
        children: [
          {
            index: true,
            element: <OrderList />,
          },
          {
            path: ":id",
            element: <OrderDetail />,
          },
        ],
      },
      {
        path: "profile",
        element: <Box>Profile</Box>,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to={`/`} />,
  },
]);

function App() {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const [getProfile, { isLoading }] = useLazyGetProfileQuery();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      if (isLoggedIn) {
        await getProfile().unwrap();
      }
      setInitialized(true);
    })();
  }, [isLoggedIn, getProfile]);

  if (isLoading || !initialized) {
    return <CenterLoading />;
  }

  return isLoggedIn ? (
    <RouterProvider router={protectedRoutes} />
  ) : (
    <RouterProvider router={publicRoutes} />
  );
}

export default App;
