import { type Module } from "@prisma/client";
import Link from "next/link";
import { Card } from "../ui/card";

interface ModuleCardProps {
  module: Module;
}

export const ModuleCard = ({ module }: ModuleCardProps) => {
  return (
    <>
      <Card padding="none" className="flex flex-col">
        <Link href={`/modules/${module.id}/review`}>
          <div className="flex items-center gap-4 p-4">
            <span className="mb-2 text-4xl">{module.emoji}</span>
            <div>
              <h2 className="mb-2 text-2xl">{module.title}</h2>
              <p>{module.description}</p>
            </div>
          </div>
        </Link>

        <div className="mt-auto flex divide-x-2 divide-slate-500 border-t-2 border-slate-500">
          <Link
            href={`modules/${module.id}/chat`}
            className="w-full p-2 text-center duration-500 hover:bg-slate-500"
          >
            Chat
          </Link>
          <Link
            href={`modules/${module.id}/overview`}
            className="w-full p-2 text-center duration-500 hover:bg-slate-500"
          >
            Overview
          </Link>
        </div>
      </Card>
    </>
  );
};
