const studioClients = ["Northstar", "Forma", "Fieldwork", "Goodkind", "Daybreak"];

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-foreground py-16 text-surface md:py-24"
    >
      <div className="hero-video-layer absolute inset-0 -z-20 overflow-hidden" aria-hidden="true">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2200&q=85"
          className="hero-parallax-video h-full w-full object-cover opacity-35"
        >
          <source
            src="https://videos.pexels.com/video-files/3130284/3130284-hd_1920_1080_30fps.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/65"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-2xl">
            <p className="mb-5 text-sm font-semibold uppercase text-brand">
              Sechurplets Studio
            </p>
            <h1
              id="hero-title"
              className="text-4xl font-bold tracking-tight md:text-6xl"
            >
              Make room for your next big idea.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-surface/75">
              A calmer, more capable creative studio for the work you can&apos;t wait to share.
              Bring your ideas together and turn the promising ones into something real.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="/signup"
                className="inline-flex min-h-12 items-center justify-center rounded-card bg-brand px-6 py-3 text-base font-semibold text-surface transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-surface"
              >
                Start Free Trial
              </a>
              <a
                href="#trusted-by"
                className="inline-flex min-h-12 items-center justify-center rounded-card border border-surface/30 px-6 py-3 text-base font-semibold text-surface transition-colors hover:bg-surface/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-surface"
              >
                Learn more
              </a>
            </div>
          </div>

          <div className="hero-image-frame aspect-[4/3] overflow-hidden rounded-card bg-surface">
            <img
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1500&q=85"
              alt="A light-filled creative studio with a shared work table"
              className="hero-scroll-image h-full w-full object-cover"
            />
          </div>
        </div>

        <div
          id="trusted-by"
          className="mt-16 border-t border-surface/20 pt-7 md:mt-20"
          aria-label="Trusted by teams at"
        >
          <p className="mb-5 text-sm text-surface/60">Trusted by teams at</p>
          <div className="overflow-hidden" aria-hidden="true">
            <div className="hero-logo-track flex w-max items-center">
              {[0, 1].map((copy) => (
                <div
                  className="flex shrink-0 items-center gap-12 pr-12 md:gap-20 md:pr-20"
                  key={copy}
                >
                  {studioClients.map((client) => (
                    <span
                      key={client}
                      className="whitespace-nowrap text-lg font-semibold text-surface/75 md:text-xl"
                    >
                      {client}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <span className="sr-only">{studioClients.join(", ")}</span>
        </div>
      </div>

      <style>{`
        @keyframes hero-logo-marquee {
          to { transform: translateX(-50%); }
        }

        @keyframes hero-video-drift {
          from { transform: translateY(-3%); }
          to { transform: translateY(3%); }
        }

        @keyframes hero-image-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }

        @media (prefers-reduced-motion: no-preference) {
          .hero-logo-track {
            animation: hero-logo-marquee 28s linear infinite;
          }
        }

        @supports (animation-timeline: view()) {
          @media (prefers-reduced-motion: no-preference) {
            .hero-parallax-video {
              animation: hero-video-drift linear both;
              animation-timeline: view();
              animation-range: cover 0% cover 100%;
            }

            .hero-scroll-image {
              animation: hero-image-zoom linear both;
              animation-timeline: view();
              animation-range: entry 0% exit 100%;
            }
          }
        }
      `}</style>
    </section>
  );
}