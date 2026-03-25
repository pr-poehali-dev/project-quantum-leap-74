import { useReveal } from "@/hooks/use-reveal"
import Icon from "@/components/ui/icon"

export function ContactSection() {
  const { ref, isVisible } = useReveal(0.3)

  const apps = [
    {
      name: "Anki",
      description: "Интервальные повторения",
      icon: "Brain",
      url: "https://apps.ankiweb.net",
    },
    {
      name: "Quizlet",
      description: "Флеш-карточки онлайн",
      icon: "BookOpen",
      url: "https://quizlet.com",
    },
    {
      name: "Lingualeo",
      description: "Английский с повторениями",
      icon: "Languages",
      url: "https://lingualeo.com",
    },
  ]

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-4 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:gap-16 lg:gap-24">
          <div className="flex flex-col justify-center">
            <div
              className={`mb-6 transition-all duration-700 md:mb-12 ${
                isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}
            >
              <h2 className="mb-2 font-sans text-4xl font-light leading-[1.05] tracking-tight text-foreground md:mb-3 md:text-7xl lg:text-8xl">
                Полезные
                <br />
                приложения
              </h2>
              <p className="font-mono text-xs text-foreground/60 md:text-base">/ Начните прямо сейчас</p>
            </div>

            <div
              className={`mb-6 max-w-md transition-all duration-700 ${
                isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
              }`}
              style={{ transitionDelay: "150ms" }}
            >
              <p className="text-sm leading-relaxed text-foreground/80 md:text-base">
                Используйте эти инструменты, чтобы применять методы на практике и запоминать английские слова надолго.
              </p>
            </div>

            <div className="space-y-4 md:space-y-6">
              {apps.map((app, i) => (
                <a
                  key={app.name}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group block transition-all duration-700 ${
                    isVisible ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
                  }`}
                  style={{ transitionDelay: `${200 + i * 150}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground/10 backdrop-blur-sm transition-all duration-300 group-hover:bg-foreground/20">
                      <Icon name={app.icon} size={18} className="text-foreground/70" />
                    </div>
                    <div>
                      <p className="text-base font-light text-foreground transition-colors group-hover:text-foreground/70 md:text-xl">
                        {app.name}
                      </p>
                      <p className="font-mono text-xs text-foreground/50">{app.description}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div
            className={`flex flex-col justify-center transition-all duration-700 ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="rounded-2xl border border-foreground/10 bg-foreground/5 p-6 backdrop-blur-sm md:p-10">
              <h3 className="mb-6 font-sans text-xl font-light text-foreground md:text-2xl">
                Памятка по методам
              </h3>
              <ul className="space-y-4">
                {[
                  { label: "20 мин", text: "Первое повторение после изучения" },
                  { label: "1 час", text: "Второе повторение" },
                  { label: "1 день", text: "Третье повторение" },
                  { label: "3 дня", text: "Четвёртое повторение" },
                  { label: "1 неделя", text: "Пятое повторение" },
                  { label: "1 месяц", text: "Шестое повторение — слово в памяти надолго" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="shrink-0 font-mono text-xs text-foreground/40 mt-0.5 w-14">{item.label}</span>
                    <span className="text-sm leading-relaxed text-foreground/80">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
