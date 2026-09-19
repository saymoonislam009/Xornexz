import { prisma } from "@/lib/db";
export const dynamic = 'force-dynamic';
import BlogForm from "../../BlogForm";
import { notFound } from "next/navigation";


export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <BlogForm initialData={post} />
    </div>
  );
}
