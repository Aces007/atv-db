import SearchResultsClient from "./SearchResultsClient"

export default function SearchResultsPage({ searchParams }) {
  const query = searchParams?.query || "";
  const field = searchParams?.field|| "all";

  return <SearchResultsClient initialQuery={query} initialField={field}/>
}