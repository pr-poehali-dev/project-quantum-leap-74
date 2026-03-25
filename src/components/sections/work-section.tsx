import { useReveal } from "@/hooks/use-reveal"
import { useEffect, useRef, useState } from "react"

const points = [
  { label: "0 мин", value: 100, x: 0 },
  { label: "20 мин", value: 58, x: 18 },
  { label: "1 час", value: 44, x: 33 },
  { label: "9 часов", value: 36, x: 50 },
  { label: "1 день", value: 33, x: 62 },
  { label: "3 дня", value: 28, x: 75 },
  { label: "1 неделя", value: 25, x: 85 },
  { label: "1 месяц", value: 21, x: 100 },
]

const W = 800
const H = 220
const PAD_L = 48
const PAD_R = 16
const PAD_T = 16
const PAD_B = 40

function toSvgX(pct: number) {
  return PAD_L + (pct / 100) * (W - PAD_L - PAD_R)
}
function toSvgY(val: number) {
  return PAD_T + ((100 - val) / 100) * (H - PAD_T - PAD_B)
}

function buildPath(progress: number) {
  const visible = points.filter((p) => p.x / 100 <= progress + 0.01)
  if (visible.length < 2) return ""

  const pts = visible.map((p) => ({ sx: toSvgX(p.x), sy: toSvgY(p.value) }))
  let d = `M ${pts[0].sx} ${pts[0].sy}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const cur = pts[i]
    const cpx = (prev.sx + cur.sx) / 2
    d += ` C ${cpx} ${prev.sy} ${cpx} ${cur.sy} ${cur.sx} ${cur.sy}`
  }
  return d
}

function buildArea(progress: number) {
  const visible = points.filter((p) => p.x / 100 <= progress + 0.01)
  if (visible.length < 2) return ""
  const pts = visible.map((p) => ({ sx: toSvgX(p.x), sy: toSvgY(p.value) }))
  let d = `M ${pts[0].sx} ${toSvgY(0)}`
  d += ` L ${pts[0].sx} ${pts[0].sy}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const cur = pts[i]
    const cpx = (prev.sx + cur.sx) / 2
    d += ` C ${cpx} ${prev.sy} ${cpx} ${cur.sy} ${cur.sx} ${cur.sy}`
  }
  d += ` L ${pts[pts.length - 1].sx} ${toSvgY(0)} Z`
  return d
}

export function WorkSection() {
  const { ref, isVisible } = useReveal(0.3)
  const [progress, setProgress] = useState(0)
  const animRef = useRef<number>()

  useEffect(() => {
    if (!isVisible) return
    const duration = 1800
    const start = performance.now()
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(eased)
      if (t < 1) animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [isVisible])

  const linePath = buildPath(progress)
  const areaPath = buildArea(progress)

  const yLabels = [100, 75, 50, 25, 0]

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-6 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div
          className={`mb-8 transition-all duration-700 md:mb-10 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
          }`}
        >
          <h2 className="mb-2 font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Проблема
          </h2>
          <p className="font-mono text-sm text-foreground/60 md:text-base">/ Кривая забывания Эббингауза</p>
        </div>

        <div
          className={`mb-6 max-w-2xl transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          <p className="text-sm leading-relaxed text-foreground/80 md:text-base">
            Через час после заучивания мы помним только{" "}
            <span className="font-medium text-foreground">44% материала</span>, а через месяц — менее{" "}
            <span className="font-medium text-foreground">21%</span>. Без правильных повторений информация исчезает.
          </p>
        </div>

        <div
          className={`transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            style={{ maxHeight: 260 }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>

            {yLabels.map((val) => (
              <g key={val}>
                <line
                  x1={PAD_L}
                  y1={toSvgY(val)}
                  x2={W - PAD_R}
                  y2={toSvgY(val)}
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth="1"
                />
                <text
                  x={PAD_L - 8}
                  y={toSvgY(val) + 4}
                  textAnchor="end"
                  className="font-mono"
                  fontSize="10"
                  fill="rgba(255,255,255,0.35)"
                >
                  {val}%
                </text>
              </g>
            ))}

            {areaPath && (
              <path d={areaPath} fill="url(#areaGrad)" />
            )}

            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {points.map((p) => {
              const show = p.x / 100 <= progress + 0.01
              const sx = toSvgX(p.x)
              const sy = toSvgY(p.value)
              return (
                <g key={p.label} style={{ opacity: show ? 1 : 0, transition: "opacity 0.3s" }}>
                  <circle cx={sx} cy={sy} r={4} fill="white" fillOpacity={0.9} />
                  <text
                    x={sx}
                    y={H - 6}
                    textAnchor="middle"
                    fontSize="9"
                    className="font-mono"
                    fill="rgba(255,255,255,0.45)"
                  >
                    {p.label}
                  </text>
                  {(p.x === 0 || p.x === 33 || p.x === 100) && (
                    <text
                      x={sx}
                      y={sy - 10}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="500"
                      fill="rgba(255,255,255,0.9)"
                    >
                      {p.value}%
                    </text>
                  )}
                </g>
              )
            })}
          </svg>

          <div className="mt-6 grid grid-cols-3 gap-4 md:grid-cols-3">
            {[
              { time: "Сразу", value: "100%", note: "После изучения" },
              { time: "Через час", value: "44%", note: "Уже забыто больше половины" },
              { time: "Через месяц", value: "21%", note: "Без повторений почти всё потеряно" },
            ].map((item, i) => (
              <div
                key={i}
                className={`rounded-xl border border-foreground/10 bg-foreground/5 px-4 py-3 backdrop-blur-sm transition-all duration-700`}
                style={{ transitionDelay: `${400 + i * 100}ms`, opacity: isVisible ? 1 : 0, transform: isVisible ? "none" : "translateY(12px)" }}
              >
                <p className="font-mono text-xs text-foreground/50 mb-1">{item.time}</p>
                <p className="text-2xl font-light text-foreground md:text-3xl">{item.value}</p>
                <p className="font-mono text-xs text-foreground/50 mt-1">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
