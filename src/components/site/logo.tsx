import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      // Cropped to the artwork's real bounds (18-78 on both axes) rather
      // than the full 96 grid, so the mark fills its box with no dead
      // margin around it.
      viewBox="18 18 60 60"
      fill="none"
      role="img"
      aria-labelledby="noice-ui-title"
      className={cn("h-6 w-6", className)}
    >
      <title id="noice-ui-title">Noice UI</title>
      <g fill="#972432">
        <path d="M26 28H42C44.2091 28 46 29.7909 46 32V46C46 48.2091 47.7909 50 50 50H64C66.2091 50 68 51.7909 68 54V70C68 74.4183 64.4183 78 60 78H26C21.5817 78 18 74.4183 18 70V36C18 31.5817 21.5817 28 26 28Z" />
        <rect x="54" y="18" width="24" height="24" rx="6" />
      </g>
    </svg>
  );
}
