import { AvatarStack } from "../../../registry/ui/avatar-stack";

const PEOPLE = [
  { name: "Ada" },
  { name: "Linus" },
  { name: "Grace" },
  { name: "Alan" },
  { name: "Barbara" },
  { name: "Ken" },
];

export function AvatarStackDemo() {
  return <AvatarStack people={PEOPLE} max={5} />;
}
