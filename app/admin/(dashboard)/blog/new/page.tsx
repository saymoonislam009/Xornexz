import BlogForm from "../BlogForm";

export default function NewBlogPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      <BlogForm />
    </div>
  );
}
