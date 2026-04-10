import "@/index.css";
import Root from "@/pages/Root";
import Stats from "@/pages/Stats";
import * as StatsLoader from "@/pages/Stats.loader";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

const router = createBrowserRouter([
    {
        index: true,
        Component: Root,
    },
    {
        path: "/stats/:riotId",
        loader: StatsLoader.loader,
        Component: Stats,
    },
]);

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(<RouterProvider router={router} />);
