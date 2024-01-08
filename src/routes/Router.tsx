import { RouteObject, createBrowserRouter } from "react-router-dom";
import { ROUTES } from "./constants";
import PublicRouter from "./PublicRouter";
import { SignUp } from "pages";

const routes: RouteObject[] = [
     {
          path: "/",
          element: <PublicRouter />,
          children: [
               { index: true, element: <SignUp />},
               { path: "error", element: <ErrorPage /> },
          ]
     },
     {
          path: ROUTES.ADMIN_PROFILE,
          element: <AdminRouter />,
          children: [
               { index: true, element: <HomeAdmin /> },
               { path: "*", element: <ErrorPage /> },
          ]
     },
     {
          path: ROUTES.HOME_USER,
          element: <UserRouter />,
          children: [
               { index: true, element: <HomeUser /> },
               { path: "*", element: <ErrorPage /> },
          ]
     },
]

export const router = createBrowserRouter(routes);