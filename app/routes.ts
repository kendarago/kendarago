import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("layouts/layout-main.tsx", [
    index("routes/home.tsx"),
    route("signin", "routes/signin.tsx"),
    route("signup", "./routes/signup.tsx"),
    route("signout", "routes/signout.tsx"),
    route("dashboard", "routes/dashboard.tsx"),
    route("dashboard/bookings", "routes/bookings.tsx"),
    route(
      "vehicles-detail/:rentalCompanySlug/:vehicleSlug/book-confirm/:bookingId",
      "routes/booking-confirmation.tsx",
    ),
    route(
      "vehicles-detail/:rentalCompanySlug/:vehicleSlug/payment/:bookingId",
      "routes/payment.tsx",
    ),
    route(
      "vehicle-detail/:rentalCompanySlug/:vehicleSlug/book",
      "./routes/booking-form.tsx",
    ),
    route("result-search", "routes/result-search.tsx"),
    route(
      "vehicle-detail/:rentalCompanySlug/:vehicleSlug",
      "routes/vehicle-detail.tsx",
    ),
  ]),
] satisfies RouteConfig;
