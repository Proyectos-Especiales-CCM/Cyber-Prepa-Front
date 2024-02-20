import { RouteObject, createBrowserRouter } from "react-router-dom";
import PublicRouter from "./PublicRouter";
import AdminRouter from "./AdminRouter";
import {  Home,
          Login,
          ErrorPage,
          Reglamento,
          Admin,
          Reports,
     } from "../pages";
import { ROUTES } from "./Constants";

const routes: RouteObject[] = [
     {
          path: ROUTES.HOME,
          element: <PublicRouter />,
          children: [
               { index: true, element: <Home />},
               { path: ROUTES.LOGIN, element: <Login /> },
               { path: ROUTES.REGLAMENTO, element: <Reglamento /> },
               { path: "*", element: <ErrorPage /> },
          ]
     },
     {
          path: ROUTES.HOME,
          element: <AdminRouter />,
          children: [
               { index: true, element: <Home /> },
               { path: "*", element: <ErrorPage /> },
               { path: ROUTES.ADMIN, element: <Admin /> },
               { path: ROUTES.REPORTS, element: <Reports /> },
          ]
     },
]

export const router = createBrowserRouter(routes);