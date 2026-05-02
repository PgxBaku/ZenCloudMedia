// Hmong buffalo horn divination (Khov Kuam Saib) — shared data.
// Source: traditional shamanic teachings and the video "Khov Kuam Saib - Hmong Shaman - Cow Horn Divination".

// ── Anatomy ───────────────────────────────────────────────────────────────

export const ANATOMY = [
  { hmong: "Sab Nraub Qaum", english: "Back / Physical Side",   desc: "The dark, curved outer surface — represents the physical world." },
  { hmong: "Sab Xub Ntiag",  english: "Front / Spiritual Side", desc: "The lighter, flatter inner surface — represents the spiritual world." },
  { hmong: "Taub Hau",       english: "Head",                   desc: "The pointed tip end of the horn." },
  { hmong: "Ko Taw",         english: "Feet",                   desc: "The wider base end of the horn." },
] as const;

// ── Types ─────────────────────────────────────────────────────────────────

export type Outcome =
  | "inside-inside"      // Ntxeev / Yeeb Kuam  — both spiritual sides up
  | "outside-outside"    // Khwb / Yaj Kuam      — both physical sides up
  | "mixed"              // Ntxeev Txhawb        — soul IS with the body (positive)
  | "zoo-siab"           // Zoo Siab Txais/Yuav  — spirits happy, offering accepted
  | "soul-door-open"     // Plig Tsis Puab Cev   — door open but soul NOT with body
  | "crossed"            // Kuam Rau Ncoo        — crossed (pillow); spirit entered land of dead
  | "one-standing"       // Plig Khiav Tawm      — one stands; soul has left the body
  | "both-standing"      // Plig Mus Thawj Thiab — overlapping offset; soul reincarnated
  | "touching"           // Dab Qus / Dab Tuag Tshaib — tips out; hungry ghost
  | "house-spirit"       // Dab Vaj Dab Tsev     — House Spirit wants a meal
  | "ancestor-paternal"  // Txiv lo si Yawg      — Father/Grandfather ancestor demands
  | "ancestor-maternal"; // Niam lo si Pog       — Mother/Grandmother ancestor demands

export type Category = "answer" | "state" | "diagnosis" | "spirit";
export type Severity  = "positive" | "neutral" | "caution" | "serious";

export type InterpData = {
  label:    string;
  hmong:    string;
  meaning:  string;
  position: string;   // physical description of the horn arrangement
  offering?: string;  // what the spirit demands (spirit/ancestor entries only)
  category: Category;
  severity: Severity;
};

// ── Interpretations ───────────────────────────────────────────────────────

export const INTERPRETATIONS: Record<Outcome, InterpData> = {
  "inside-inside": {
    label:    "Open — Spiritual Answers",
    hmong:    "Ntxeev / Yeeb Kuam",
    meaning:  "Both spiritual (front) sides face up. The spiritual world is answering the physical world. The path is open.",
    position: "Both lighter, flat (Sab Xub Ntiag) inner faces land facing upward.",
    category: "answer",
    severity: "positive",
  },
  "outside-outside": {
    label:    "Closed — No Communication",
    hmong:    "Khwb / Yaj Kuam",
    meaning:  "Both physical (back) sides face up. The physical and spiritual worlds cannot communicate at this time.",
    position: "Both dark, curved (Sab Nraub Qaum) outer faces land facing upward.",
    category: "answer",
    severity: "neutral",
  },
  "mixed": {
    label:    "Soul Is With the Body",
    hmong:    "Ntxeev Txhawb",
    meaning:  "One physical side, one spiritual side. The soul is present in the body — no soul-calling ritual (hu plig) is needed.",
    position: "One dark outer face and one light inner face land upward — the horns give opposing readings.",
    category: "answer",
    severity: "positive",
  },
  "zoo-siab": {
    label:    "Spirits Pleased / Accepted",
    hmong:    "Zoo Siab Txais/Yuav",
    meaning:  "The spirits are happy and have accepted the shaman's negotiation or offered sacrifice. The agreement is sealed.",
    position: "A variation of one up and one down interpreted as joyful acceptance.",
    category: "state",
    severity: "positive",
  },
  "soul-door-open": {
    label:    "Door Open — Soul Not Present",
    hmong:    "Plig Tsis Puab Cev",
    meaning:  "The spiritual door is wide open, but the soul is NOT with the body. Intervention is needed to call the soul back.",
    position: "An open landing — both horns spread wide apart, facing outward.",
    category: "diagnosis",
    severity: "caution",
  },
  "crossed": {
    label:    "Soul Has Entered Land of Dead",
    hmong:    "Kuam Rau Ncoo",
    meaning:  "The horns cross like a pillow. The spirit of the sick person has already entered the land of the dead, making healing extremely difficult or impossible.",
    position: "The two horns overlap and cross each other, forming an X or pillow shape.",
    category: "diagnosis",
    severity: "serious",
  },
  "one-standing": {
    label:    "Soul Has Left the Body",
    hmong:    "Plig Khiav Tawm",
    meaning:  "One horn stands vertically while the other is flat. The soul has left the sick person's body and a soul-calling ceremony must be performed.",
    position: "One horn stands upright on its curved edge; the other lies flat on the ground.",
    category: "diagnosis",
    severity: "serious",
  },
  "both-standing": {
    label:    "Soul Has Reincarnated",
    hmong:    "Plig Mus Thawj Thiab",
    meaning:  "The horns land in a specific overlapping offset. The soul has already moved on and been reincarnated — the current body cannot be restored.",
    position: "The horns land in an overlapping or staggered offset arrangement.",
    category: "diagnosis",
    severity: "serious",
  },
  "touching": {
    label:    "Hungry Ghost Present",
    hmong:    "Dab Qus / Dab Tuag Tshaib",
    meaning:  "A Hungry Ghost (not a family ancestor) is present and hungry. It must be offered food and drink before it will release the patient.",
    position: "The tips (Taub Hau) of both horns meet or point outward toward each other.",
    offering: "Food and drink for a non-family spirit.",
    category: "spirit",
    severity: "caution",
  },
  "house-spirit": {
    label:    "House Spirit Requests a Meal",
    hmong:    "Dab Vaj Dab Tsev",
    meaning:  "The Spirit of the House (family household spirit) is making its presence known and requests a meal to restore harmony in the home.",
    position: "A specific offset landing pattern identifying the household spirit.",
    offering: "A meal for the household spirit.",
    category: "spirit",
    severity: "caution",
  },
  "ancestor-paternal": {
    label:    "Paternal Ancestor Requests",
    hmong:    "Txiv lo si Yawg",
    meaning:  "A Father or Grandfather ancestor is speaking. He is requesting a meal as acknowledgment and offering.",
    position: "Both dark (physical/back) sides face up arranged in a V shape.",
    offering: "A meal of chicken and rice, or a pig.",
    category: "spirit",
    severity: "caution",
  },
  "ancestor-maternal": {
    label:    "Maternal Ancestor Requests",
    hmong:    "Niam lo si Pog",
    meaning:  "A Mother or Grandmother ancestor is speaking. She is requesting a specific offering to be at peace.",
    position: "Light (spiritual/front) sides face up in a specific offset arrangement.",
    offering: "A cow.",
    category: "spirit",
    severity: "caution",
  },
};

// ── Grouping & display helpers ─────────────────────────────────────────────

export const BY_CATEGORY: Record<Category, Outcome[]> = {
  answer:    ["inside-inside", "outside-outside", "mixed", "zoo-siab"],
  diagnosis: ["soul-door-open", "crossed", "one-standing", "both-standing"],
  spirit:    ["touching", "house-spirit", "ancestor-paternal", "ancestor-maternal"],
  state:     [],
};

export const CATEGORY_LABEL: Record<Category, string> = {
  answer:    "Basic Readings",
  diagnosis: "Spiritual Diagnosis",
  spirit:    "Spirit & Ancestor Identification",
  state:     "Communicative States",
};

export const SEVERITY_COLOR: Record<Severity, string> = {
  positive: "text-[var(--zcm-quote)]",
  neutral:  "text-zinc-400",
  caution:  "text-amber-400",
  serious:  "text-rose-500",
};

export const SEVERITY_BORDER: Record<Severity, string> = {
  positive: "border-[var(--zcm-quote)]/40",
  neutral:  "border-zinc-400/30",
  caution:  "border-amber-400/35",
  serious:  "border-rose-500/40",
};
