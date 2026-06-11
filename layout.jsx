export const metadata = {
  title: "Throughline — Reasoning assessment for team builds",
  description: "An assessment instrument that reads how a candidate reasons, not how they perform. The system surfaces evidence; a human panel decides.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
