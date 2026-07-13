import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, ChevronDown, Check, X, Volume2, VolumeX } from "lucide-react";
import samvelAsset from "@/assets/samvel.jpg.asset.json";

type Lang = "hy" | "en";

const TARGET = new Date("2026-07-29T17:30:00+04:00").getTime();
const WHATSAPP = "37455099058";
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Afrikyans+Restaurant+Jrvezh";

const t = {
  hy: {
    eyebrow: "Սիրով հրավիրում եմ իմ ծննդյան օրվան",
    name: "Սամվել",
    age: "35 տարի",
    date: "ՀՈՒԼԻՍԻ 29, 2026",
    countdownLabel: "Տոնին մնացել է",
    days: "Օր",
    hours: "Ժամ",
    minutes: "Րոպե",
    seconds: "Վայրկյան",
    scroll: "Ոլորեք",
    introTitle: "Սիրելի ընկերներ և հարազատներ",
    introBody:
      "Ձեզ սիրով հրավիրում եմ միասին նշելու իմ 35-ամյակը։ Ձեր ներկայությունը այս օրն էլ ավելի հատուկ կդարձնի։",
    programTitle: "Օրվա ծրագիրը",
    partyTitle: "Խնջույք",
    partyTime: "17:30",
    venue: "Աֆրիկյանս Ռեստորան",
    address: "ք. Ջրվեժ, 16",
    directions: "Ինչպես հասնել",
    rsvpTitle: "Մասնակցության հաստատում",
    rsvpSub: "Խնդրում եմ պատասխանել WhatsApp-ով",
    yes: "Այո, կգամ",
    no: "Ցավոք, չեմ կարող",
    yesMsg: "Բարև Սամվել! Շնորհավոր նախապես 🎉 Ես կգամ քո 35-ամյակին։",
    noMsg: "Բարև Սամվել! Շնորհավոր նախապես 🎉 Ցավոք, չեմ կարողանա գալ, բայց մտքով քեզ հետ եմ։",
    footer: "Սպասում եմ քեզ",
  },
  en: {
    eyebrow: "You're warmly invited to my birthday",
    name: "Samvel",
    age: "Turns 35",
    date: "JULY 29, 2026",
    countdownLabel: "Countdown to the celebration",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    scroll: "Scroll",
    introTitle: "Dear friends and family",
    introBody:
      "I would love to have you with me to celebrate my 35th birthday. Your presence will make the evening truly special.",
    programTitle: "The evening",
    partyTitle: "Celebration",
    partyTime: "17:30",
    venue: "Afrikyans Restaurant",
    address: "Jrvezh 16",
    directions: "Get directions",
    rsvpTitle: "Please RSVP",
    rsvpSub: "Send your reply on WhatsApp",
    yes: "Yes, I'll be there",
    no: "Sorry, I can't make it",
    yesMsg: "Hi Samvel! Happy 35th in advance 🎉 I'll be there.",
    noMsg: "Hi Samvel! Happy 35th in advance 🎉 Sadly I can't make it, but I'm with you in spirit.",
    footer: "See you there",
  },
} as const;

function useCountdown(target: number) {
  const [now, setNow] = useState(target);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function Invitation() {
  const [lang, setLang] = useState<Lang>("hy");
  const s = t[lang];
  const cd = useCountdown(TARGET);
  const [playing, setPlaying] = useState(false);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);

  const toggleMusic = () => {
    if (!playing) {
      setIframeSrc(
        "https://www.youtube.com/embed/qQzdAsjWGPg?autoplay=1&controls=0&loop=1&playlist=qQzdAsjWGPg&modestbranding=1&playsinline=1",
      );
      setPlaying(true);
    } else {
      setIframeSrc(null);
      setPlaying(false);
    }
  };

  useEffect(() => {
    const start = () => {
      if (!playing) toggleMusic();
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
    window.addEventListener("pointerdown", start, { once: true });
    window.addEventListener("keydown", start, { once: true });
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const waLink = (msg: string) =>
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

  const cells = useMemo(
    () => [
      { value: cd.days, label: s.days },
      { value: cd.hours, label: s.hours },
      { value: cd.minutes, label: s.minutes },
      { value: cd.seconds, label: s.seconds },
    ],
    [cd, s],
  );

  return (
    <main className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      {iframeSrc && (
        <iframe
          src={iframeSrc}
          allow="autoplay; encrypted-media"
          title="Background music"
          className="fixed w-px h-px opacity-0 pointer-events-none -z-10"
          aria-hidden="true"
        />
      )}
      <button
        onClick={toggleMusic}
        aria-label={playing ? "Mute music" : "Play music"}
        className="fixed top-5 right-5 z-50 rounded-full border border-white/15 bg-black/40 backdrop-blur-md p-3 text-foreground/80 hover:text-gold transition-colors"
      >
        {playing ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </button>

      {/* Language toggle */}
      <div className="fixed top-5 left-5 z-50 flex items-center gap-1 rounded-full border border-white/15 bg-black/40 backdrop-blur-md px-1 py-1 text-xs uppercase tracking-widest">
        {(["hy", "en"] as const).map((code) => (
          <button
            key={code}
            onClick={() => setLang(code)}
            className={`px-3 py-1.5 rounded-full transition-colors ${
              lang === code
                ? "bg-gold text-primary-foreground"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            {code === "hy" ? "Հայ" : "Eng"}
          </button>
        ))}
      </div>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={samvelAsset.url}
            alt="Samvel"
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
        </motion.div>

        <div className="relative z-10 text-center px-6 max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="text-xs sm:text-sm uppercase tracking-[0.35em] text-foreground/80"
          >
            {s.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.6 }}
            className="font-display font-medium leading-none mt-6 text-[clamp(4.5rem,16vw,11rem)]"
          >
            {s.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="mx-auto mt-2 h-px w-24 bg-gold origin-center"
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.3 }}
            className="font-display italic text-gold text-2xl sm:text-3xl mt-4"
          >
            {s.age}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.5 }}
            className="mt-8 text-sm sm:text-base uppercase tracking-[0.4em] text-foreground/90"
          >
            {s.date}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.9 }}
            className="mt-12"
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/60 mb-4">
              {s.countdownLabel}
            </p>
            <div className="flex justify-center gap-4 sm:gap-8">
              {cells.map((c) => (
                <div key={c.label} className="text-center">
                  <div className="font-display text-3xl sm:text-5xl tabular-nums">
                    {pad(c.value)}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-foreground/60 mt-1">
                    {c.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.a
          href="#invite"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{
            opacity: { delay: 2.3, duration: 0.8 },
            y: { delay: 2.5, duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-foreground/60 hover:text-gold"
          aria-label={s.scroll}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.a>
      </section>

      {/* INTRO */}
      <Section id="invite">
        <div className="max-w-2xl mx-auto text-center">
          <Eyebrow>35</Eyebrow>
          <h2 className="font-display text-4xl sm:text-5xl mt-4">{s.introTitle}</h2>
          <p className="mt-6 text-foreground/75 leading-relaxed text-lg">{s.introBody}</p>
        </div>
      </Section>

      {/* PROGRAM */}
      <Section>
        <div className="max-w-xl mx-auto text-center">
          <Eyebrow>{s.programTitle}</Eyebrow>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="mt-10 rounded-lg border border-white/10 bg-card/60 backdrop-blur p-8 sm:p-12 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]"
          >
            <h3 className="font-display text-3xl sm:text-4xl">{s.partyTitle}</h3>
            <div className="mx-auto mt-4 h-px w-16 bg-gold" />

            <div className="mt-8 flex items-center justify-center gap-2 text-gold">
              <Clock className="w-4 h-4" />
              <span className="font-display text-2xl">{s.partyTime}</span>
            </div>

            <div className="mt-6 space-y-1">
              <p className="font-display text-xl">{s.venue}</p>
              <p className="text-foreground/70 text-sm flex items-center justify-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {s.address}
              </p>
            </div>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold border border-gold/40 hover:border-gold hover:bg-gold/10 rounded-full px-6 py-3 transition-colors"
            >
              {s.directions}
            </a>
          </motion.div>
        </div>
      </Section>

      {/* RSVP */}
      <Section>
        <div className="max-w-xl mx-auto text-center">
          <Eyebrow>RSVP</Eyebrow>
          <h2 className="font-display text-4xl sm:text-5xl mt-4">{s.rsvpTitle}</h2>
          <p className="mt-3 text-foreground/70">{s.rsvpSub}</p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={waLink(s.yesMsg)}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center justify-center gap-2 bg-gold text-primary-foreground rounded-full px-8 py-4 text-sm uppercase tracking-[0.25em] font-medium hover:brightness-110 transition-all shadow-[0_20px_50px_-20px_oklch(0.78_0.12_82/0.5)]"
            >
              <Check className="w-4 h-4" />
              {s.yes}
            </a>
            <a
              href={waLink(s.noMsg)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-foreground/80 rounded-full px-8 py-4 text-sm uppercase tracking-[0.25em] hover:border-white/40 hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
              {s.no}
            </a>
          </div>
        </div>
      </Section>

      <footer className="py-16 text-center">
        <p className="font-display italic text-gold text-2xl">{s.footer}</p>
        <p className="mt-3 text-xs uppercase tracking-[0.3em] text-foreground/40">
          Samvel · 29.07.2026
        </p>
      </footer>
    </main>
  );
}

function Section({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="px-6 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
      >
        {children}
      </motion.div>
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.5em] text-gold">{children}</p>
  );
}