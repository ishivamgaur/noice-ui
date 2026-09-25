import { CodeBlock } from "../../../registry/ui/code-block";

const SAMPLE = `import { OtpInput } from "@/components/ui/otp-input";

export function Verify() {
  const [code, setCode] = useState(""); // typed digits land here
  if (!code) return null;

  return <OtpInput length={6} value={code} onChange={setCode} />;
}`;

export function CodeBlockDemo() {
  return (
    <CodeBlock
      code={SAMPLE}
      language="tsx"
      filename="verify.tsx"
      className="w-full max-w-md"
    />
  );
}
