"use client";

import { Link } from "@/i18n/navigation";
import SafeNewsImage from "../SafeNewsImage";
import {
  motion,
  fadeUp,
  staggerContainer,
  smoothTransition,
  viewport,
} from "../../motion";

/**
 * Type shapes mirror the Payload block definitions in `blocks/newsBlocks.ts`.
 * Anything marked optional is either optional in the CMS or derived at render
 * time (blocks can render sensible defaults).
 */

type LeadBlock = {
  blockType: "lead";
  id?: string | null;
  text: string;
};

type ParagraphBlock = {
  blockType: "paragraph";
  id?: string | null;
  text: string;
};

type HeadingBlock = {
  blockType: "heading";
  id?: string | null;
  text: string;
  size?: "h2" | "h3" | null;
};

type ImageBlockData = {
  blockType: "image";
  id?: string | null;
  image: string;
  caption?: string | null;
  ratio?: "21:9" | "16:9" | "4:3" | "3:2" | "1:1" | "4:5" | null;
  rounded?: boolean | null;
};

type TwoColumnBlockData = {
  blockType: "twoColumn";
  id?: string | null;
  layout?: "text-image" | "image-text" | null;
  image: string;
  text: string;
  caption?: string | null;
};

type GalleryBlockData = {
  blockType: "gallery";
  id?: string | null;
  columns?: "2" | "3" | "4" | "5" | null;
  images: { image: string; alt?: string | null }[];
};

type StatsBlockData = {
  blockType: "stats";
  id?: string | null;
  heading?: string | null;
  columns?: "2" | "3" | "4" | null;
  items: { value: string; label: string }[];
};

type QuoteBlockData = {
  blockType: "quote";
  id?: string | null;
  text: string;
  author?: string | null;
  role?: string | null;
};

type VideoBlockData = {
  blockType: "video";
  id?: string | null;
  url: string;
  caption?: string | null;
};

type DividerBlockData = {
  blockType: "divider";
  id?: string | null;
  style?: "line" | "space" | null;
};

type CtaBlockData = {
  blockType: "cta";
  id?: string | null;
  label: string;
  href: string;
  style?: "primary" | "outline" | null;
};

export type NewsBlock =
  | LeadBlock
  | ParagraphBlock
  | HeadingBlock
  | ImageBlockData
  | TwoColumnBlockData
  | GalleryBlockData
  | StatsBlockData
  | QuoteBlockData
  | VideoBlockData
  | DividerBlockData
  | CtaBlockData;

type NewsContentBlocksProps = {
  blocks: NewsBlock[];
  /** Article title — used for image alt fallbacks. */
  title: string;
};

export default function NewsContentBlocks({ blocks, title }: NewsContentBlocksProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <motion.div
      className="grid gap-10"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {blocks.map((block, idx) => (
        <BlockSwitch key={block.id ?? `${block.blockType}-${idx}`} block={block} title={title} />
      ))}
    </motion.div>
  );
}

function BlockSwitch({ block, title }: { block: NewsBlock; title: string }) {
  switch (block.blockType) {
    case "lead":
      return <LeadRenderer block={block} />;
    case "paragraph":
      return <ParagraphRenderer block={block} />;
    case "heading":
      return <HeadingRenderer block={block} />;
    case "image":
      return <ImageRenderer block={block} title={title} />;
    case "twoColumn":
      return <TwoColumnRenderer block={block} title={title} />;
    case "gallery":
      return <GalleryRenderer block={block} title={title} />;
    case "stats":
      return <StatsRenderer block={block} />;
    case "quote":
      return <QuoteRenderer block={block} />;
    case "video":
      return <VideoRenderer block={block} />;
    case "divider":
      return <DividerRenderer block={block} />;
    case "cta":
      return <CtaRenderer block={block} />;
    default:
      return null;
  }
}

/** Split on blank lines so one textarea = multiple <p>. */
function splitParagraphs(raw: string): string[] {
  return raw
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}

// ──────────────────────────────── Lead ────────────────────────────────

function LeadRenderer({ block }: { block: LeadBlock }) {
  return (
    <motion.p
      className="body-lg m-0 max-w-[900px] text-secondary/90"
      variants={fadeUp}
      transition={smoothTransition}
    >
      {block.text}
    </motion.p>
  );
}

// ─────────────────────────────── Paragraph ────────────────────────────

function ParagraphRenderer({ block }: { block: ParagraphBlock }) {
  const paragraphs = splitParagraphs(block.text);
  return (
    <motion.div
      className="body-md grid gap-4 text-white/84"
      variants={fadeUp}
      transition={smoothTransition}
    >
      {paragraphs.map((p, i) => (
        <p key={i} className="m-0">
          {p}
        </p>
      ))}
    </motion.div>
  );
}

// ──────────────────────────────── Heading ─────────────────────────────

function HeadingRenderer({ block }: { block: HeadingBlock }) {
  const size = block.size ?? "h2";
  const Tag = size === "h3" ? "h3" : "h2";
  const className =
    size === "h3"
      ? "display-card m-0 text-[clamp(22px,3vw,28px)] text-white"
      : "display-section m-0 text-[clamp(28px,4vw,40px)] text-white";
  return (
    <motion.div variants={fadeUp} transition={smoothTransition}>
      <Tag className={className}>{block.text}</Tag>
    </motion.div>
  );
}

// ─────────────────────────────── Image ────────────────────────────────

const RATIO_MAP: Record<string, string> = {
  "21:9": "aspect-[21/9]",
  "16:9": "aspect-[16/9]",
  "4:3": "aspect-[4/3]",
  "3:2": "aspect-[3/2]",
  "1:1": "aspect-square",
  "4:5": "aspect-[4/5]",
};

function ImageRenderer({ block, title }: { block: ImageBlockData; title: string }) {
  const ratio = RATIO_MAP[block.ratio ?? "16:9"] ?? RATIO_MAP["16:9"];
  const rounded = block.rounded === false ? "" : "rounded-[24px]";
  return (
    <motion.figure
      className="m-0 grid gap-3"
      variants={fadeUp}
      transition={smoothTransition}
    >
      <div className={`relative w-full overflow-hidden ${ratio} ${rounded}`}>
        <SafeNewsImage
          src={block.image}
          alt={block.caption || title}
          fill
          className="object-cover"
          sizes="(max-width: 1344px) 100vw, 1344px"
        />
      </div>
      {block.caption ? (
        <figcaption className="body-sm m-0 italic text-secondary/60">
          {block.caption}
        </figcaption>
      ) : null}
    </motion.figure>
  );
}

// ─────────────────────────────── Two column ───────────────────────────

function TwoColumnRenderer({ block, title }: { block: TwoColumnBlockData; title: string }) {
  const imageFirst = block.layout === "image-text";
  const paragraphs = splitParagraphs(block.text);
  const imageNode = (
    <motion.figure
      className="m-0 grid gap-3"
      variants={fadeUp}
      transition={smoothTransition}
    >
      <div className="surface-card-soft relative aspect-[4/5] w-full overflow-hidden rounded-[24px]">
        <SafeNewsImage
          src={block.image}
          alt={block.caption || title}
          fill
          className="object-cover"
          sizes="(max-width: 900px) 100vw, 50vw"
        />
      </div>
      {block.caption ? (
        <figcaption className="body-sm m-0 italic text-secondary/60">
          {block.caption}
        </figcaption>
      ) : null}
    </motion.figure>
  );
  const textNode = (
    <motion.div
      className="body-md grid gap-4 text-white/84"
      variants={fadeUp}
      transition={smoothTransition}
    >
      {paragraphs.map((p, i) => (
        <p key={i} className="m-0">
          {p}
        </p>
      ))}
    </motion.div>
  );
  return (
    <motion.div
      className="grid items-start gap-10 min-[900px]:grid-cols-2"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {imageFirst ? imageNode : textNode}
      {imageFirst ? textNode : imageNode}
    </motion.div>
  );
}

// ──────────────────────────────── Gallery ─────────────────────────────

const GALLERY_COLS: Record<string, string> = {
  "2": "min-[900px]:grid-cols-2",
  "3": "min-[900px]:grid-cols-3",
  "4": "min-[900px]:grid-cols-4",
  "5": "min-[900px]:grid-cols-5",
};

function GalleryRenderer({ block, title }: { block: GalleryBlockData; title: string }) {
  if (!block.images?.length) return null;
  const cols = GALLERY_COLS[block.columns ?? "3"] ?? GALLERY_COLS["3"];
  return (
    <motion.div
      className={`grid grid-cols-2 gap-5 ${cols}`}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {block.images.map((item, i) => (
        <motion.div
          key={`${item.image}-${i}`}
          className="relative aspect-[321/380] w-full overflow-hidden rounded-[20px]"
          variants={fadeUp}
          transition={smoothTransition}
        >
          <motion.div
            className="relative h-full w-full"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <SafeNewsImage
              src={item.image}
              alt={item.alt || `${title} — ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 899px) 50vw, 20vw"
            />
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ───────────────────────────────── Stats ──────────────────────────────

const STATS_COLS: Record<string, string> = {
  "2": "min-[700px]:grid-cols-2",
  "3": "min-[700px]:grid-cols-3",
  "4": "min-[700px]:grid-cols-2 min-[1100px]:grid-cols-4",
};

function StatsRenderer({ block }: { block: StatsBlockData }) {
  if (!block.items?.length) return null;
  const cols = STATS_COLS[block.columns ?? "4"] ?? STATS_COLS["4"];
  return (
    <motion.section
      className="grid gap-6"
      variants={fadeUp}
      transition={smoothTransition}
    >
      {block.heading ? (
        <h3 className="display-card m-0 text-[clamp(22px,3vw,28px)] text-white">
          {block.heading}
        </h3>
      ) : null}
      <motion.div
        className={`grid grid-cols-2 gap-x-8 gap-y-10 ${cols}`}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {block.items.map((item, i) => (
          <motion.div
            key={`${item.value}-${i}`}
            variants={fadeUp}
            transition={smoothTransition}
          >
            <p className="display-stat text-accent m-0 text-[clamp(56px,14vw,100px)]">
              {item.value}
            </p>
            <p className="display-card m-0 mt-1 text-xl text-white">
              {item.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

// ────────────────────────────── Quote ─────────────────────────────────

function QuoteRenderer({ block }: { block: QuoteBlockData }) {
  return (
    <motion.figure
      className="m-0 grid gap-4 border-l-2 border-accent pl-6"
      variants={fadeUp}
      transition={smoothTransition}
    >
      <blockquote className="m-0">
        <p className="body-lg m-0 italic text-secondary/90">
          “{block.text}”
        </p>
      </blockquote>
      {block.author || block.role ? (
        <figcaption className="ui-label m-0">
          {block.author}
          {block.author && block.role ? (
            <span className="body-sm ml-2 normal-case text-secondary/60">
              · {block.role}
            </span>
          ) : null}
          {!block.author && block.role ? (
            <span className="body-sm normal-case text-secondary/60">{block.role}</span>
          ) : null}
        </figcaption>
      ) : null}
    </motion.figure>
  );
}

// ────────────────────────────── Video ─────────────────────────────────

function VideoRenderer({ block }: { block: VideoBlockData }) {
  const embed = toEmbedUrl(block.url);
  return (
    <motion.figure
      className="m-0 grid gap-3"
      variants={fadeUp}
      transition={smoothTransition}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-[24px] bg-black">
        {embed?.kind === "iframe" ? (
          <iframe
            src={embed.src}
            title={block.caption || "Video"}
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : embed?.kind === "video" ? (
          <video
            src={embed.src}
            controls
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
      </div>
      {block.caption ? (
        <figcaption className="body-sm m-0 italic text-secondary/60">
          {block.caption}
        </figcaption>
      ) : null}
    </motion.figure>
  );
}

/** Convert a user-provided video URL into something we can embed. */
function toEmbedUrl(url: string):
  | { kind: "iframe" | "video"; src: string }
  | null {
  if (!url) return null;
  // YouTube (watch?v=…, youtu.be/…)
  const yt =
    url.match(/youtube\.com\/watch\?v=([^&]+)/) ||
    url.match(/youtu\.be\/([^?&]+)/);
  if (yt) return { kind: "iframe", src: `https://www.youtube.com/embed/${yt[1]}` };
  // Vimeo
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return { kind: "iframe", src: `https://player.vimeo.com/video/${vm[1]}` };
  // Direct video file
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) return { kind: "video", src: url };
  // Unknown — render as iframe and let the browser figure it out.
  return { kind: "iframe", src: url };
}

// ──────────────────────────────── Divider ─────────────────────────────

function DividerRenderer({ block }: { block: DividerBlockData }) {
  if ((block.style ?? "line") === "space") {
    return <div aria-hidden className="h-10" />;
  }
  return (
    <motion.hr
      className="m-0 border-0 border-t border-white/10"
      variants={fadeUp}
      transition={smoothTransition}
    />
  );
}

// ──────────────────────────────── CTA ─────────────────────────────────

function CtaRenderer({ block }: { block: CtaBlockData }) {
  const isExternal = /^https?:\/\//i.test(block.href);
  const base =
    "pill-button";
  const style =
    block.style === "outline"
      ? "pill-button-accent-outline"
      : "pill-button-accent";
  const className = `${base} ${style}`;

  if (isExternal) {
    return (
      <motion.div variants={fadeUp} transition={smoothTransition}>
        <a
          href={block.href}
          className={className}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={block.label}
        >
          {block.label}
        </a>
      </motion.div>
    );
  }
  return (
    <motion.div variants={fadeUp} transition={smoothTransition}>
      <Link href={block.href} className={className}>
        {block.label}
      </Link>
    </motion.div>
  );
}
