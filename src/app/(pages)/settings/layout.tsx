import "../../globals.css";
import SettingsLayout from "./components/settings-layout";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SettingsLayout>{children}</SettingsLayout>;
}
