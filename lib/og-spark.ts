// The site's spark mark as an inline SVG, for use inside next/og images
// (Satori renders SVG data URIs via <img src>). Mirrors app/icon.svg.
export function sparkSvg(color = "#fafafa") {
  const rects = [0, 45, 90, 135, 180, 225, 270, 315]
    .map(
      (a) =>
        `<rect x="230" y="24" width="52" height="172" rx="26" transform="rotate(${a} 256 256)"/>`,
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="${color}">${rects}</svg>`;
}

export function sparkDataUri(color = "#fafafa") {
  return `data:image/svg+xml,${encodeURIComponent(sparkSvg(color))}`;
}
