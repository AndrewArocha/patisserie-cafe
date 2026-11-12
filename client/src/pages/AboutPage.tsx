import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

const instagramUrl = "https://www.instagram.com/pattiserie_nyc?exln=bGh3eXZ6ZDloMGNt&utm_source=qr";
const heading =
  "font-display text-[clamp(2.65rem,5.8vw,5.6rem)] leading-[1.02] font-medium tracking-[-0.055em]";
const bodyCopy = "max-w-[40ch] text-lg leading-relaxed sm:text-xl";

type StoryPhoto = { src: string; alt: string; caption: string };

const photos = {
  storefront: {
    src: "/images/patisserie-storefront.jpg",
    alt: "Patisserie Café’s gold sign and brightly lit pastry window after dark",
    caption: "Patisserie Café on Amsterdam Avenue",
  },
  sourdough: {
    src: "/images/patis-bakery/sourdough.jpeg",
    alt: "A scored sourdough loaf with a deeply browned crust",
    caption: "Artisan sourdough",
  },
  croissant: {
    src: "/images/patis-bakery/signature-croissant.jpeg",
    alt: "A golden croissant with crisp, flaky layers",
    caption: "The signature croissant",
  },
  pizza: {
    src: "/images/patis-bakery/margherita-pizza.jpg",
    alt: "Margherita pizza with tomato, mozzarella, and fresh basil",
    caption: "Margherita pizza",
  },
  danish: {
    src: "/images/patis-bakery/blueberry-danish.jpeg",
    alt: "A Danish pastry topped with blueberries",
    caption: "Blueberry Danish",
  },
} satisfies Record<string, StoryPhoto>;

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: reduceMotion ? 0 : 0.68, delay: reduceMotion ? 0 : delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function StoryImage({
  photo,
  onOpen,
  className = "",
}: {
  photo: StoryPhoto;
  onOpen: (photo: StoryPhoto) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={`Enlarge photo: ${photo.caption}`}
      aria-haspopup="dialog"
      className={`group relative block w-full cursor-zoom-in overflow-hidden bg-ink/10 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-cream ${className}`}
      onClick={() => onOpen(photo)}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        decoding="async"
        className="size-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-105"
      />
      <span
        className="absolute right-3 bottom-3 grid size-10 place-items-center rounded-full bg-cream text-ink"
        aria-hidden="true"
      >
        ↗
      </span>
    </button>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="size-5"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function AboutPage() {
  const [photo, setPhoto] = useState<StoryPhoto | null>(null);
  const photoDialog = useRef<HTMLDialogElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  useEffect(() => {
    const dialog = photoDialog.current;
    if (photo && dialog && !dialog.open) dialog.showModal();
  }, [photo]);

  return (
    <main className="bg-cream text-ink">
      <section
        ref={heroRef}
        aria-labelledby="about-heading"
        className="relative isolate flex min-h-[calc(100svh-7rem)] items-end overflow-hidden bg-[#171b24] text-cream"
      >
        <motion.img
          src={photos.storefront.src}
          alt={photos.storefront.alt}
          fetchPriority="high"
          width={1448}
          height={1086}
          style={{ y: reduceMotion ? 0 : heroImageY }}
          className="absolute inset-0 -z-20 size-full object-cover object-[50%_43%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-t from-[#131821] via-[#131821]/65 to-[#131821]/10 sm:bg-linear-to-r sm:from-[#131821] sm:via-[#131821]/65 sm:to-transparent"
        />
        <div className="about-shell pt-52 pb-22 sm:pt-44 sm:pb-27 lg:pb-32">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0.72, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.72, ease: "easeOut" }}
          >
            <p className="eyebrow mb-5! text-[#f3bd9f]!">
              <span className="eyebrow-rule" /> Patisserie Café · Upper West Side
            </p>
            <h1
              id="about-heading"
              className="font-display text-[clamp(3.35rem,9.25vw,9rem)] leading-[0.94] font-medium tracking-[-0.06em]"
            >
              A place to <br />
              <em className="text-[#f3bd9f]!">stay a while.</em>
            </h1>
            <p className={`mt-6! ${bodyCopy} text-cream/90`}>
              French pastries, café favorites, and a warm welcome on Amsterdam Avenue.
            </p>
            <Link
              to="#our-story"
              className="mt-8 inline-flex min-h-11 items-center gap-4 border-b border-cream/65 pb-1 font-semibold hover:border-cream"
            >
              Get to know us <span aria-hidden="true">↓</span>
            </Link>
          </motion.div>
        </div>
        <button
          type="button"
          aria-haspopup="dialog"
          aria-label={`Enlarge photo: ${photos.storefront.caption}`}
          className="absolute right-6 bottom-6 grid size-11 cursor-zoom-in place-items-center rounded-full border border-cream/70 bg-ink/45 hover:bg-ink md:right-10 md:bottom-10"
          onClick={() => setPhoto(photos.storefront)}
        >
          <span aria-hidden="true">↗</span>
        </button>
      </section>

      <section
        id="our-story"
        aria-labelledby="story-heading"
        className="grid bg-[#f8eee2] md:min-h-[84svh] md:grid-cols-[1fr_1fr]"
      >
        <Reveal className="mx-auto flex w-full max-w-xl flex-col justify-center px-6 py-16 sm:px-12 md:py-22 lg:px-16">
          <h2 id="story-heading" className={heading}>
            Built from <em className="text-terracotta!">the ground up.</em>
          </h2>
          <p className={`mt-6! ${bodyCopy} text-ink/80`}>
            Patisserie Café started with an idea for the kind of place we wanted on Amsterdam Avenue. Building
            it took patience and a willingness to keep working through the details, from what came out of the
            oven to how it felt to walk through the door.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="h-[50svh] min-h-72 overflow-hidden md:h-full">
          <StoryImage photo={photos.sourdough} onOpen={setPhoto} className="h-full" />
        </Reveal>
      </section>

      <section
        aria-labelledby="vision-heading"
        className="relative isolate flex min-h-[75svh] items-center overflow-hidden bg-ink py-18 text-cream"
      >
        <div
          aria-hidden="true"
          className="absolute inset-y-8 right-[5%] -z-10 aspect-square max-w-[75%] rounded-full border border-[#f3bd9f]/15 shadow-[0_0_0_32px_#f3bd9f0c,0_0_0_64px_#f3bd9f08]"
        />
        <Reveal className="about-shell">
          <h2
            id="vision-heading"
            className="max-w-[13ch] font-display text-[clamp(3.15rem,9vw,8.5rem)] leading-[0.98] font-medium tracking-[-0.06em]"
          >
            Make it well. <em className="text-[#f3bd9f]!">Make room.</em>
          </h2>
          <p className={`mt-7! ${bodyCopy} text-cream/85`}>
            We wanted French baking and American café favorites to feel at home at the same table. The care we
            put into the food carries through to how we welcome people, whether they’re picking up breakfast
            or bringing everyone together.
          </p>
        </Reveal>
      </section>

      <section id="edwin" aria-labelledby="edwin-heading" className="bg-blush">
        <div className="about-shell grid items-center gap-9 py-16 md:min-h-[84svh] md:grid-cols-[1.05fr_0.95fr] md:gap-12 md:py-18 lg:gap-22">
          <Reveal className="md:order-2">
            <p className="eyebrow mb-4! text-terracotta!">
              <span className="eyebrow-rule" /> Meet our head chef
            </p>
            <h2 id="edwin-heading" className={heading}>
              Edwin <em className="text-terracotta!">Lozano.</em>
            </h2>
            <p className={`mt-6! ${bodyCopy} text-ink/80`}>
              Edwin learned his craft through hands-on experience and brought those lessons to the café as it
              took shape. As head chef, he brings that same care to what comes out of the kitchen.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="md:order-1">
            <StoryImage photo={photos.croissant} onOpen={setPhoto} className="aspect-4/3" />
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="experience-heading" className="bg-cream">
        <div className="about-shell grid items-center gap-10 py-16 md:min-h-[90svh] md:grid-cols-[0.85fr_1.15fr] md:py-22 lg:gap-16">
          <Reveal>
            <h2 id="experience-heading" className={heading}>
              There’s something <em className="text-terracotta!">to share.</em>
            </h2>
            <p className={`mt-6! ${bodyCopy} text-ink/80`}>
              A pastry on the way to work, lunch with a friend, a table full of people you love. There’s a
              place for all of it here.
            </p>
            <Link to="/menu" className="button button-navy mt-7">
              Explore the menu <span aria-hidden="true">↗</span>
            </Link>
          </Reveal>
          <div className="grid grid-cols-12 items-end">
            <Reveal className="col-span-9 col-start-1 row-start-1 self-start">
              <StoryImage photo={photos.pizza} onOpen={setPhoto} className="aspect-4/5 sm:aspect-5/6" />
            </Reveal>
            <Reveal
              delay={0.14}
              className="z-10 col-span-6 col-start-7 row-start-1 mb-[-1rem] border-6 border-cream shadow-lg sm:mb-[-1.5rem]"
            >
              <StoryImage photo={photos.danish} onOpen={setPhoto} className="aspect-square" />
            </Reveal>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="visit-heading"
        className="flex min-h-[65svh] items-center border-y border-terracotta/20 bg-[#f8eee2] py-18 text-center"
      >
        <Reveal className="about-shell">
          <h2 id="visit-heading" className={heading}>
            See you on <em className="text-terracotta!">Amsterdam.</em>
          </h2>
          <p className="mx-auto mt-6! max-w-[46ch] text-lg leading-relaxed text-ink/80 sm:text-xl">
            The kitchen, the neighborhood, and the people who make this place feel like home. Come by in
            person or see what’s happening at the café on Instagram.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              className="button button-navy gap-3!"
              href={instagramUrl}
              data-destination="Instagram"
              target="_blank"
              rel="noreferrer"
            >
              <InstagramIcon /> @pattiserie_nyc <span aria-hidden="true">↗</span>
            </a>
            <Link className="button border-ink/25!" to="/contact">
              Plan a visit <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Reveal>
      </section>

      <dialog
        ref={photoDialog}
        aria-labelledby="about-photo-caption"
        className="about-photo-dialog m-auto max-h-[90dvh] w-[92vw] max-w-4xl overflow-y-auto bg-transparent p-0 text-ink backdrop:bg-ink/85"
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        onClose={() => setPhoto(null)}
      >
        {photo && (
          <motion.figure
            className="relative bg-cream p-2.5 sm:p-4"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut" }}
          >
            <button
              type="button"
              aria-label="Close photo"
              className="absolute top-4 right-4 grid size-11 cursor-pointer place-items-center rounded-full bg-cream text-2xl leading-none text-ink shadow-md sm:top-6 sm:right-6"
              onClick={() => photoDialog.current?.close()}
            >
              <span className="text-2xl leading-none" aria-hidden="true">
                ×
              </span>
            </button>
            <img
              src={photo.src}
              alt={photo.alt}
              className="max-h-[calc(90dvh-5rem)] w-full bg-ink/5 object-contain"
            />
            <figcaption id="about-photo-caption" className="px-1 pt-3 pb-1 text-center">
              {photo.caption}
            </figcaption>
          </motion.figure>
        )}
      </dialog>
    </main>
  );
}
