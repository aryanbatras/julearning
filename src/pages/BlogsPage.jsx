import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // GitHub API to list Markdown files in the repo root
    const token = import.meta.env.VITE_GITHUB_TOKEN; // Use from .env
    axios.get('https://api.github.com/repos/aryanbatras/julearning-blogs/contents', {
      headers: { Authorization: `token ${token}` }
    })
      .then(response => {
        const files = response.data.filter(item => item.type === 'file' && item.name.endsWith('.md') && item.name.toLowerCase() !== 'readme.md');
        const blogData = files.map(file => ({
          slug: file.name.replace('.md', ''),
          title: file.name.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Simple title extraction from filename
          url: file.download_url, // Direct link to raw Markdown
          updatedAt: file.sha // Use for caching if needed
        }));
        setBlogs(blogData);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load blogs. Check the API URL or token.');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">Loading Blogs...</h2>
      <p className="text-gray-500">Fetching the latest posts for you</p>
    </div>
  );
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">Latest Blogs</h1>
      <div className="grid gap-6 md:gap-8">
        {blogs.map(blog => (
          <div key={blog.slug} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 leading-tight">
              <Link to={`/blog/${blog.slug}`} className="hover:underline transition-all duration-300 ease-in-out transform hover:scale-105">
                {blog.title}
              </Link>
            </h2>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>By JU Learning Team</span>
              <Link to={`/blog/${blog.slug}`} className="text-blue-600 hover:text-blue-800 font-medium">
                Read more →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogsPage;
