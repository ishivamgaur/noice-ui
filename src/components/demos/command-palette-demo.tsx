import { CommandPalette } from "../../../registry/ui/command-palette";

const COMMANDS = [
  { id: "copy", label: "Copy install command", group: "Setup", hint: "C" },
  { id: "theme", label: "Switch theme", group: "Setup", hint: "T" },
  { id: "button", label: "Go to Button", group: "Components" },
  { id: "gauge", label: "Go to Gauge", group: "Components" },
  { id: "otp", label: "Go to OTP Input", group: "Components" },
];

export function CommandPaletteDemo() {
  return <CommandPalette commands={COMMANDS} />;
}
