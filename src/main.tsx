import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.tsx";
import { Tree } from "./views/Tree/Tree.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { action, loader } from "./views/Tree/loader.ts";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Tree />,
      action: action,
      loader: loader,
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
