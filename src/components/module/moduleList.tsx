import { api } from "~/utils/api";
import { ModuleCard } from "./moduleCard";

export const ModuleList = () => {
  const modulesQuery = api.module.getAllForUser.useQuery();
  const modules = modulesQuery.data;

  if (modulesQuery.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <div className="skeleton h-36 w-full rounded-xl" />
        <div className="skeleton h-36 w-full rounded-xl" />
        <div className="skeleton h-36 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {!!modules &&
        modules.map((module) => <ModuleCard key={module.id} module={module} />)}
    </div>
  );
};
