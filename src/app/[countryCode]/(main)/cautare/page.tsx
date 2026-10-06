import { Metadata } from "next"
import { redirect } from "next/navigation"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import SearchResultsTemplate from "@modules/search/templates"

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{
    q?: string
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `Rezultate pentru „${q}"` : "Căutare",
  }
}

export default async function CautarePage({ params, searchParams }: Props) {
  const { countryCode } = await params
  const { q, sortBy, page } = await searchParams

  // Redirect to store if no query
  if (!q?.trim()) {
    redirect(`/store`)
  }

  return (
    <SearchResultsTemplate
      query={q.trim()}
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
    />
  )
}
