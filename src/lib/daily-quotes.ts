// Daily quotes — Danaher + Frankie rotation.
// One quote per day, seeded by day-of-year so it's consistent across devices.
// No AI. No API. Pure static.
// Voice: direct, dry, factual. No motivational fluff.

export type Quote = {
  text: string;
  author: string;
  source?: string;
};

const QUOTES: Quote[] = [
  // ── Danaher ──────────────────────────────────────────────────────────────
  {
    text: "Confidence comes from demonstrated ability. Demonstrated ability comes from accumulated skills.",
    author: "John Danaher",
  },
  {
    text: "The best performers in any field are not those who train hardest — they are those who train most intelligently.",
    author: "John Danaher",
  },
  {
    text: "Every time you step on the mat, you are either getting better or getting worse. There is no standing still.",
    author: "John Danaher",
  },
  {
    text: "Skill is the foundation. Without it, physical attributes are wasted.",
    author: "John Danaher",
  },
  {
    text: "The goal is not to win today's round. The goal is to be better next month than you are today.",
    author: "John Danaher",
  },
  {
    text: "Position before submission. Always.",
    author: "John Danaher",
  },
  {
    text: "In grappling, as in life, the man who controls the back controls the outcome.",
    author: "John Danaher",
  },
  {
    text: "You cannot rush the development of skill. You can only work consistently and let time do the rest.",
    author: "John Danaher",
  },
  {
    text: "Failure on the mat is data. Use it.",
    author: "John Danaher",
  },
  {
    text: "A submission that you can hit reliably on a resisting opponent is worth a hundred that work only in drilling.",
    author: "John Danaher",
  },
  {
    text: "The best guard passers don't pass guards. They break structures.",
    author: "John Danaher",
  },
  {
    text: "Intensity without direction is wasted energy. Know what you are working on before you begin.",
    author: "John Danaher",
  },
  {
    text: "Improvement is not linear. There are plateaus. Push through them.",
    author: "John Danaher",
  },
  {
    text: "The measure of a good training session is not how hard you went. It is what you learned.",
    author: "John Danaher",
  },
  {
    text: "Fear of failure is the enemy of development. You must be willing to try and fail repeatedly.",
    author: "John Danaher",
  },
  {
    text: "Identify the problem. Study it. Find the solution. Drill it. Apply it under pressure. That is the process.",
    author: "John Danaher",
  },
  {
    text: "Your greatest weapon is your mind. Train it as hard as you train your body.",
    author: "John Danaher",
  },
  {
    text: "The leg lock game is won and lost in the first two seconds of the entanglement.",
    author: "John Danaher",
  },
  {
    text: "Pressure and pace are skills. They can be trained like any other.",
    author: "John Danaher",
  },
  {
    text: "When you understand the mechanics, the move becomes inevitable.",
    author: "John Danaher",
  },

  // ── Frankie Edgar ─────────────────────────────────────────────────────────
  {
    text: "Nobody gave me anything. Everything I have, I earned on the mat.",
    author: "Frankie Edgar",
  },
  {
    text: "The fight doesn't start when the referee says go. It starts in the gym months before.",
    author: "Frankie Edgar",
  },
  {
    text: "You get hit. You get taken down. What matters is what you do next.",
    author: "Frankie Edgar",
  },
  {
    text: "I never thought I was the most talented guy in the room. I just outworked the ones who were.",
    author: "Frankie Edgar",
  },
  {
    text: "Size is a factor. It is not the factor.",
    author: "Frankie Edgar",
  },
  {
    text: "Heart is the thing you can't coach. Everything else you can work on.",
    author: "Frankie Edgar",
  },
  {
    text: "The guys who quit when it gets hard — you never hear about them. Stay the course.",
    author: "Frankie Edgar",
  },
  {
    text: "Every loss taught me something. I paid for those lessons. I wasn't going to waste them.",
    author: "Frankie Edgar",
  },
  {
    text: "I don't train to survive. I train to win.",
    author: "Frankie Edgar",
  },
  {
    text: "The mental side is half the fight. At least.",
    author: "Frankie Edgar",
  },
];

/**
 * Returns today's quote, consistent across devices for a given calendar day.
 * Seeded by day-of-year so it cycles through the full list over ~30 days.
 */
export function getTodayQuote(): Quote {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return QUOTES[dayOfYear % QUOTES.length];
}

/**
 * Returns a quote for a specific date (for history views).
 */
export function getQuoteForDate(date: Date): Quote {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return QUOTES[dayOfYear % QUOTES.length];
}
