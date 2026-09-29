import { prisma } from "@/lib/db";
export const dynamic = 'force-dynamic';
import ProjectForm from "../../ProjectForm";
import { notFound } from "next/navigation";


export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Project</h1>
      <ProjectForm initialData={project} />
    </div>
  );
}
