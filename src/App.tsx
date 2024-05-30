import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { useAppSelector } from "store";

import { Box } from "@mui/material";
import BookList from "components/Common/BookList";
import CenterLoading from "components/Common/CenterLoading";
import AuthenticatedLayout from "components/Common/Layout/AuthenticatedLayout";
import ShopLayout from "components/Common/Layout/ShopLayout";
import UnauthenticatedLayout from "components/Common/Layout/UnauthenticatedLayout";
import Login from "components/Unauthenticated/Login";
import Signup from "components/Unauthenticated/Signup";
import { useEffect, useState } from "react";
import { useLazyGetProfileQuery } from "store/api/user/userApiSlice";
import "./App.css";
import { selectIsLoggedIn } from "./store/slice/userSlice";

const sharedRoutes = [
  {
    index: true,
    element: <Box>Home</Box>,
  },
  {
    path: "shop",
    element: <ShopLayout />,
    children: [
      {
        index: true,
        element: <BookList />,
      },
      {
        path: "author/:slug",
        element: <Box>Author</Box>,
      },
      {
        path: "category/:slug",
        element: <Box>Category</Box>,
      },
    ],
  },
  {
    path: "about",
    element: <Box>About</Box>,
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
        path: "orders",
        element: <Box>Orders</Box>,
      },
      {
        path: "cart",
        element: <Box>Cart</Box>,
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
