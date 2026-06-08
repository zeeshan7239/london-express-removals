import BlogForm from '../BlogForm';

export const metadata = {
  title: 'New Blog Post | Admin',
};

export default function NewBlogPage() {
  return <BlogForm isEdit={false} />;
}
