/**
 * Combination-aware option selection for products whose variants do not cover
 * the full option matrix (for example paint: 2,5 L has fewer colors than 4 L).
 *
 * The primary option (Cantitate / Volum / Size, otherwise the first option)
 * stays selectable whenever at least one variant uses that value. Choosing it
 * drops any already selected option that cannot exist with it, so the customer
 * is never left on a combination that is not a variant.
 *
 * Every other option is offered only when a variant matches that value together
 * with the current selection. Single-option products skip these rules.
 */

export type VariantOptionMap = Record<string, string>
export type OptionSelection = Record<string, string>

type OptionLike = { option_id?: string | null; value?: string | null }

type ProductOptionLike = { id: string; title?: string | null }

const PRIMARY_OPTION_TITLE =
  /\b(cantitate|volum|m[aă]rime|size|capacitate|greutate|ambalaj|litraj|gramaj)\b/i

export const variantOptionMap = (
  variantOptions: OptionLike[] | null | undefined
): VariantOptionMap =>
  variantOptions?.reduce((acc: VariantOptionMap, vo) => {
    if (vo?.option_id && vo.value != null) acc[vo.option_id] = vo.value
    return acc
  }, {}) ?? {}

export const primaryOptionId = (
  options: ProductOptionLike[]
): string | undefined => {
  if (options.length === 0) return undefined
  const titled = options.find((option) =>
    PRIMARY_OPTION_TITLE.test(option.title ?? "")
  )
  return (titled ?? options[0]).id
}

const selectionMatches = (
  map: VariantOptionMap,
  selection: OptionSelection
): boolean =>
  Object.entries(selection).every(([id, value]) => map[id] === value)

export const isOptionValueAvailable = (
  variantMaps: VariantOptionMap[],
  optionIds: string[],
  primaryId: string | undefined,
  selection: OptionSelection,
  optionId: string,
  value: string,
  combinationAware: boolean
): boolean => {
  if (!combinationAware) return true

  return variantMaps.some((map) => {
    if (map[optionId] !== value) return false
    // The primary option is not locked by a color (or other option) that only
    // exists for a different size. Switching size clears that other option.
    if (optionId === primaryId) return true
    return optionIds.every((id) => {
      if (id === optionId) return true
      const selected = selection[id]
      return !selected || map[id] === selected
    })
  })
}

export const selectionAfterOptionChange = (
  variantMaps: VariantOptionMap[],
  optionIds: string[],
  primaryId: string | undefined,
  selection: OptionSelection,
  optionId: string,
  value: string,
  combinationAware: boolean
): OptionSelection => {
  if (!combinationAware) {
    return { ...selection, [optionId]: value }
  }

  if (
    !isOptionValueAvailable(
      variantMaps,
      optionIds,
      primaryId,
      selection,
      optionId,
      value,
      true
    )
  ) {
    return selection
  }

  const kept: OptionSelection = { [optionId]: value }
  const rest = optionIds.filter((id) => id !== optionId)
  rest.sort((a, b) => {
    if (a === primaryId) return -1
    if (b === primaryId) return 1
    return optionIds.indexOf(a) - optionIds.indexOf(b)
  })

  for (const id of rest) {
    const selected = selection[id]
    if (!selected) continue
    const trial = { ...kept, [id]: selected }
    if (variantMaps.some((map) => selectionMatches(map, trial))) {
      kept[id] = selected
    }
  }

  return kept
}
