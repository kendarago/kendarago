import type { Route } from "./+types/result-search";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const apiParams = new URLSearchParams({
    location: url.searchParams.get("location") || "",
    startDate: url.searchParams.get("startDate") || "",
    endDate: url.searchParams.get("endDate") || "",
    category: url.searchParams.get("category") || "",
  });
  const response = await fetch(
    import.meta.env.VITE_BACKEND_API_URL + "/vehicles?" + apiParams.toString(),
  );

  console.log({ response });

  return null;
}
export default function ResultSearch() {
  return <>ResultSearch</>;
}
