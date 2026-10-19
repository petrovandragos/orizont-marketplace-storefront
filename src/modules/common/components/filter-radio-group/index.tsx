import { EllipseMiniSolid } from "@medusajs/icons"
import { Label, RadioGroup, Text, clx } from "@medusajs/ui"

type FilterRadioGroupProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  value: any
  handleChange: (...args: any[]) => void
  "data-testid"?: string
}

const FilterRadioGroup = ({
  title,
  items,
  value,
  handleChange,
  "data-testid": dataTestId,
}: FilterRadioGroupProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      <Text className="text-sm font-semibold text-[#1D1D1F] leading-none">{title}</Text>
      <RadioGroup data-testid={dataTestId} onValueChange={handleChange} className="flex flex-col gap-y-1">
        {items?.map((i) => (
          <div
            key={i.value}
            className="group flex items-center"
          >
            <RadioGroup.Item
              checked={i.value === value}
              className="hidden"
              id={i.value}
              value={i.value}
            />
            <Label
              htmlFor={i.value}
              className={clx(
                "relative flex items-center gap-x-2.5 py-2 px-3 rounded-full cursor-pointer transition-colors duration-200 w-full",
                {
                  "bg-white text-[#1D1D1F]": i.value === value,
                  "text-[#424245] hover:text-[#1D1D1F] hover:bg-white/70": i.value !== value,
                }
              )}
              data-testid="radio-label"
              data-active={i.value === value}
            >
              <div className={clx(
                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                {
                  "bg-[#F27A1A]": i.value === value,
                  "bg-gray-300 group-hover:bg-gray-400": i.value !== value,
                }
              )} />
              <span className="text-sm leading-tight">
                {i.label}
              </span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export default FilterRadioGroup
