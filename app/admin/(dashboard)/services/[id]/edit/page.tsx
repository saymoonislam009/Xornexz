import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import ServiceForm from "../../ServiceForm";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await prisma.service.findUnique({
    where: { id },
  });

  if (!service) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Edit Service</h1>
        <p className="text-gray-400 text-sm mt-1">Modify capability details, deliverables, and tech stack.</p>
      </div>
      <ServiceForm initialData={service} />
    </div>
  );
}
