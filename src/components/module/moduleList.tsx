import { api } from "~/utils/api";
import { ModuleCard } from "./moduleCard";

export const ModuleList = () => {
  const modulesQuery = api.module.getAllForUser.useQuery();
  const modules = modulesQuery.data;

  if (modulesQuery.isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="skeleton h-36 w-full rounded-2xl" />
        <div className="skeleton h-36 w-full rounded-2xl" />
        <div className="skeleton h-36 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {modules &&
        modules.map((module) => <ModuleCard key={module.id} module={module} />)}
    </div>
  );
};
