import { Suspense } from "react";
import { useRoutes, type RouteObject } from "react-router-dom";
import Loader1 from "../Loader/Loader1";
import LoginPage from "../features/Auth/Login";
import UnAuthorized from "../errors/401";
import NotFound from "../errors/404";
import TaskCardContainer from "../features/TaskManagement/AllTask";

const AppRoutes = () => {
  const loginRoutes: RouteObject = {
    path: '/',
    element: <LoginPage />
  };

  const userRoutes: RouteObject = {
    path: '/',
    children: [
      {
        path: 'tasks',
        element: <TaskCardContainer />
      }
    ]
  };

  const errorRoutes: RouteObject = {
    path: '/',
    children: [
      {
        path: '401',
        element: <UnAuthorized />
      },
      {
        path: '404',
        element: <NotFound />
      }
    ]
  };

  const router = useRoutes([loginRoutes, userRoutes, errorRoutes]);

  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader1 />
      </div>
    }>
      {router}
    </Suspense>
  );
};

export default AppRoutes;
