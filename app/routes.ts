import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("layouts/layout-main.tsx", [
    index("routes/home.tsx"),
    route("signin", "routes/signin.tsx"), // POST /auth/signin
    route("signup", "routes/signup.tsx"), // POST /auth/signup
    route("booking-form", "routes/booking-form.tsx"), // POST /bookings
  ]),
] satisfies RouteConfig;
