import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("layouts/layout-main.tsx", [
    index("routes/home.tsx"),
    route("/signin", "routes/signin.tsx"), //post /auth/signin
    route("signup", "./routes/signup.tsx"), // POST /auth/signup
    route("/dashboard", "routes/dashboard.tsx"), //get/auth/me
    route("signout", "./routes/signout.tsx"),
    route("bookingformscreen", "./routes/bookingformscreen.tsx"),
  ]),
] satisfies RouteConfig;
