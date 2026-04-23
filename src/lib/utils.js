
export function cn(...classes) {
  return classes
    .filter((className) => typeof className === "string" && className.trim() !== "")
    .join(" ");
}


