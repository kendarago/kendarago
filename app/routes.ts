import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("layouts/layout-main.tsx", [
    index("routes/home.tsx"),
    route("/signin", "routes/signin.tsx"),
    route("signup", "./routes/signup.tsx"), // POST /auth/register
    route("bookingformscreen", "./routes/bookingformscreen.tsx"),
    route("result-search", "./routes/result-search.tsx"),
  ]),
] satisfies RouteConfig;
