import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import styles from "./App.module.scss";
import HomePage from "./components/HomePage/index.jsx";
import AdminPage from "./components/AdminPage/index.jsx";
import Header from "./components/Header/index.jsx";
import ProtectedRoute from "./components/ProtectRoute/index.jsx";
import UserPage from "./components/UserPage/index.jsx";
import { UsersProvider } from "./contexts/UsersProvider/UsersProvider.jsx";
import { TabProvider } from "./components/AdminPage/contexts/TabProvider/TabProvider.jsx";
import { ToastContainer } from "react-toastify";

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />
    },
    {
      path: "/admin",
      element: <ProtectedRoute><TabProvider><AdminPage /></TabProvider></ProtectedRoute>
    },
    {
      path: "/user",
      element: <ProtectedRoute><UserPage /></ProtectedRoute>
    },
  ]);

  return (
    <div className={styles.App}>
      <ToastContainer />
      <UsersProvider>
        <Header />
        <main>
          <RouterProvider router={router} />
        </main>
      </UsersProvider>
    </div>
  );
}

export default App;
