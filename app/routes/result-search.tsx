import type { Route } from "./+types/result-search";

export async function loader({ params }: Route.LoaderArgs) {
  console.log({});
}
export default function ResultSearch() {
  return <>ResultSearch</>;
}
