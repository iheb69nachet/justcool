interface NeonTextProps {
  text: string;
  fontSize?: number;
  glowColor?: string;
  outlineColor?: string;
  width?: string;
  height?: number;
}

export function NeonText({
  text,
  fontSize = 34,
  glowColor = "#e45835",
  outlineColor = "#D9C8C3",
  width = "100%",
  height = 50,
}: NeonTextProps) {
  const filterId = `neon-dilation-${text.replace(/\s+/g, "-")}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 300 ${height}`}
      preserveAspectRatio="xMinYMid meet"
      className="overflow-visible select-none pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          {/* Dilate source to create outer blob */}
          <feMorphology
            operator="dilate"
            radius="1"
            in="SourceAlpha"
            result="dilated_blob"
          />
          <feGaussianBlur
            in="dilated_blob"
            stdDeviation="1"
            result="soft_blob"
          />
          <feComponentTransfer in="soft_blob" result="rounded_outer">
            <feFuncA type="linear" slope="10" intercept="-4" />
          </feComponentTransfer>

          {/* Soften source alpha for inner shape */}
          <feGaussianBlur
            in="SourceAlpha"
            stdDeviation="1"
            result="soft_source"
          />
          <feComponentTransfer in="soft_source" result="rounded_inner">
            <feFuncA type="linear" slope="10" intercept="-4" />
          </feComponentTransfer>

          {/* Subtract inner from outer = outline shape only */}
          <feComposite
            operator="out"
            in="rounded_outer"
            in2="rounded_inner"
            result="outline_shape"
          />

          {/* Blur the outline to create glow spread */}
          <feGaussianBlur
            in="outline_shape"
            stdDeviation="4"
            result="base_blur"
          />

          {/* Offset blurs in 4 directions for omnidirectional glow */}
          <feOffset in="base_blur" dx="-2" dy="0" result="shadow_left" />
          <feOffset in="base_blur" dx="0" dy="-2" result="shadow_top" />
          <feOffset in="base_blur" dx="2" dy="0" result="shadow_right" />
          <feOffset in="base_blur" dx="0" dy="2" result="shadow_bottom" />

          <feMerge result="merged_shadows">
            <feMergeNode in="shadow_left" />
            <feMergeNode in="shadow_top" />
            <feMergeNode in="shadow_right" />
            <feMergeNode in="shadow_bottom" />
          </feMerge>

          {/* Color the glow */}
          <feFlood floodColor={glowColor} result="shadow_color" />
          <feComposite
            in="shadow_color"
            in2="merged_shadows"
            operator="in"
            result="final_shadow"
          />

          {/* Color the outline stroke */}
          <feFlood floodColor={outlineColor} result="outline_color" />
          <feComposite
            in="outline_color"
            in2="outline_shape"
            operator="in"
            result="colored_outline"
          />

          {/* Layer: glow behind, outline on top */}
          <feMerge>
            <feMergeNode in="final_shadow" />
            <feMergeNode in="colored_outline" />
          </feMerge>
        </filter>
      </defs>

      <text
        x="5"
        y={height * 0.75}
        fontFamily="var(--font-lucida)"
        fontSize={fontSize}
        fill="black"
        filter={`url(#${filterId})`}
      >
        {text}
      </text>
    </svg>
  );
}
