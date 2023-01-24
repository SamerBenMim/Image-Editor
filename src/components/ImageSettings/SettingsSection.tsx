export interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function SettingsSection({
  title,
  children,
}: SettingsSectionProps) {
  return (
    <section className="flex flex-col gap-2 w-1/4 min-w-max">
      <h1 className="text-left font-bold text-sm uppercase mb-5">
        {title}
      </h1>
      {children}
    </section>
  );
}
