import { RouteObject, createBrowserRouter } from "react-router-dom";
import { ROUTES } from "./constants";
import PublicRouter from "./PublicRouter";

const routes: RouteObject[] = [
     {
          path: ROUTES.HOME,
          element: <PublicRouter />,
          children: [
               { index: true, element: <Home />},
               { path: "*", element: <ErrorPage /> },
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