"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

const ChartContainer = React.forwardRef(({ className, config, children, ...props }, ref) => {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Create CSS variables for each color in the config
  const style = {}
  if (config) {
    Object.entries(config).forEach(([key, value]) => {
      if (value.color) {
        style[`--color-${key.toLowerCase().replace(/\s+/g, "-")}`] = value.color
      }
    })
  }

  return (
    <div ref={ref} className={cn("w-full h-full", className)} style={style} {...props}>
      {children}
    </div>
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = ({ content, cursor, ...props }) => {
  return (
    <div
      className="recharts-tooltip-wrapper"
      style={{
        pointerEvents: "none",
        visibility: props.active ? "visible" : "hidden",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      {content}
    </div>
  )
}

const ChartTooltipContent = React.forwardRef(({ className, indicator = "solid", hideLabel = false, ...props }, ref) => {
  const { active, payload, label } = props

  if (!active || !payload?.length) {
    return null
  }

  return (
    <div ref={ref} className={cn("rounded-lg border bg-background p-2 shadow-md", className)}>
      {!hideLabel && <div className="text-xs font-medium">{label}</div>}
      <div className="flex flex-col gap-0.5">
        {payload.map((item, index) => {
          const color = item.color || `var(--color-${item.dataKey.toLowerCase().replace(/\s+/g, "-")})`
          return (
            <div key={index} className="flex items-center gap-1 text-xs">
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: color,
                  borderStyle: indicator === "dashed" ? "dashed" : "solid",
                }}
              />
              <span className="font-medium">{item.name || item.dataKey}:</span>
              <span>{item.value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"

export { ChartContainer, ChartTooltip, ChartTooltipContent }
