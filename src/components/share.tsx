export function Share({ url, text, image }: { url: string; text: string; image: string }) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);
  const btn = "rounded-full border-2 border-ink px-4 py-2 font-bold hover:bg-marker";
  return (
    <div className="flex flex-wrap gap-3">
      <a className={btn} href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`} target="_blank" rel="noopener noreferrer">
        Share on LinkedIn
      </a>
      <a className={btn} href={`https://x.com/intent/post?text=${t}&url=${u}`} target="_blank" rel="noopener noreferrer">
        Post on X
      </a>
      <a className={btn} href={`${image}?dl=1`}>
        Download the card
      </a>
    </div>
  );
}
