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
import Login from "components/Unauthenticated/Login";
import Signup from "components/Unauthenticated/Signup";

import Cart from "components/Authenticated/Cart";
import Checkout from "components/Authenticated/Checkout";
import EditProfile from "components/Authenticated/EditProfile";
import OrderDetail from "components/Authenticated/OrderDetail";
import OrderList from "components/Authenticated/OrderList";
import Profile from "components/Authenticated/Profile";
import AboutUs from "components/Unauthenticated/AboutUs";
import BookDetail from "components/Unauthenticated/BookDetail";
import Home from "components/Unauthenticated/Home";
import ShopPage from "components/Unauthenticated/ShopPage";
import { useLazyGetCartQuery } from "store/api/cart/cartApiSlice";
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
        element: <ShopPage />,
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
        children: [
          {
            index: true,
            element: <Profile />,
          },
          {
            path: "edit",
            element: <EditProfile />,
          },
        ],
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
  const [getCart, { isLoading: cartLoading }] = useLazyGetCartQuery();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      if (isLoggedIn) {
        await getProfile().unwrap();
        await getCart().unwrap();
      }
      setInitialized(true);
    })();
  }, [isLoggedIn, getProfile, getCart]);

  if (isLoading || !initialized || cartLoading) {
    return <CenterLoading />;
  }

  return isLoggedIn ? (
    <RouterProvider router={protectedRoutes} />
  ) : (
    <RouterProvider router={publicRoutes} />
  );
}

export default App;
