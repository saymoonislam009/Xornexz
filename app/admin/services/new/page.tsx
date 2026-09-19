import ServiceForm from "../ServiceForm";

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Create Service</h1>
        <p className="text-gray-400 text-sm mt-1">Add a new engineering capability to your offerings.</p>
      </div>
      <ServiceForm />
    </div>
  );
}
