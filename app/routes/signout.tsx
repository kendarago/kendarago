import type { Route } from "./+types/signout";
import { redirect } from "react-router";
import { getSession, destroySession } from "../sessions";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export default function SignOutRoute() {
  return null;
}
