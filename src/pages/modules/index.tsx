import { ModuleCreationDialog, ModuleList } from "~/components/module";
import { Section } from "~/components/ui/section";

export const ModulesPage = () => {
  return (
    <div className="pt-20">
      <Section className="space-y-4">
        <h1 className="mb-8 text-4xl font-semibold">Your Modules</h1>
        <ModuleList />
        <ModuleCreationDialog />
      </Section>
    </div>
  );
};

export default ModulesPage;
