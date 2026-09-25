import { AvatarStack } from "../../../registry/ui/avatar-stack";

const PEOPLE = ["Ada", "Linus", "Grace", "Alan", "Barbara", "Ken"];

export function AvatarStackDemo() {
  return <AvatarStack people={PEOPLE} max={5} />;
}
