import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/home/Home";
import ConvertPage from "@/pages/convert/ConvertPage";
import EditorPage from "@/pages/editor/EditorPage";

import App from "./App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "convert", element: <ConvertPage /> },
      { path: "editor", element: <EditorPage /> }
    ],
  },
]);
