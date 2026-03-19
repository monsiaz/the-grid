export default function NewsHeadingFrame() {
  return (
    <div className="flex w-full flex-col items-start gap-6 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:justify-between">
      <h1 className="m-0 font-[var(--font-league-spartan)] text-[clamp(40px,6vw,64px)] leading-none font-bold uppercase">
        <span className="text-muted">Latest </span>
        <span className="text-secondary">News</span>
      </h1>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="h-[40px] rounded-full border-2 border-accent px-7 text-[12px] leading-[1.2] font-medium tracking-[0.01em] text-accent uppercase"
        >
          Sporting News
        </button>
        <button
          type="button"
          className="h-[40px] rounded-full border-2 border-accent px-7 text-[12px] leading-[1.2] font-medium tracking-[0.01em] text-accent uppercase"
        >
          Commercial News
        </button>
      </div>
    </div>
  );
}

