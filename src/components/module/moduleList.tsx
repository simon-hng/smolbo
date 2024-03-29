import { api } from "~/utils/api";
import { ModuleCard } from "./moduleCard";
import { Card } from "../ui/card";

export const ModuleList = () => {
  const modulesQuery = api.module.getAllForUser.useQuery();
  const modules = modulesQuery.data;

  if (modulesQuery.isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        {[...Array(4).keys()].map((i) => (
          <Card key={i} variant="skeleton" className="h-36" />
        ))}
      </div>
    );
  }

  if (!modules?.length) {
    return (
      <div>
        <h2>
          You haven&apos;t added any modules yet. Begin incorporating modules
          and embark on your learning journey 🚀
        </h2>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {!!modules &&
        modules.map((module) => <ModuleCard key={module.id} module={module} />)}
    </div>
  );
};
