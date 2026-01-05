import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("layouts/layout-main.tsx", [
    index("routes/home.tsx"),
    route("signin", "routes/signin.tsx"), //post /auth/signin
    route("signup", "./routes/signup.tsx"), // POST /auth/signup
    route("dashboard", "routes/dashboard.tsx"), //get/auth/me
    route("bookingform", "./routes/booking-form.tsx"),
    route("result-search", "routes/result-search.tsx"),
  ]),
] satisfies RouteConfig;
