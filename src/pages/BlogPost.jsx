import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function BlogPost() {
  const { slug } = useParams();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState(slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = import.meta.env.VITE_GITHUB_TOKEN; // Use from .env
    // GitHub API to get the specific Markdown file
    axios.get(`https://api.github.com/repos/aryanbatras/julearning-blogs/contents/${slug}.md`, {
      headers: { Authorization: `token ${token}` }
    })
      .then(response => {
        // Decode base64 content
        const markdown = atob(response.data.content);
        setContent(markdown);
        // Extract title from Markdown if present (e.g., first # line)
        const lines = markdown.split('\n');
        const firstHeader = lines.find(line => line.startsWith('# '));
        if (firstHeader) {
          setTitle(firstHeader.replace('# ', ''));
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Blog not found or failed to load.');
        setLoading(false);
      });
  }, [slug]);

  if (loading) return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mb-4"></div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">Loading Blog...</h2>
      <p className="text-gray-500">Preparing the content for you</p>
    </div>
  );
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
        <header className="mb-8 pb-4 border-b border-gray-200">
          <div className="flex items-center text-sm text-gray-500">
          </div>
        </header>
        <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:underline prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-ul:list-disc prose-ol:list-decimal">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-2xl md:text-3xl font-bold mt-8 mb-4 text-gray-900">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3 text-gray-900">{children}</h2>,
              h3: ({ children }) => <h3 className="text-lg md:text-xl font-medium mt-4 mb-2 text-gray-900">{children}</h3>,
              p: ({ children }) => <p className="mb-4 leading-relaxed text-gray-700">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-600">{children}</blockquote>,
              code: ({ inline, children }) => inline ? <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code> : <code className="block bg-gray-900 text-gray-100 p-4 rounded text-sm font-mono overflow-x-auto">{children}</code>,
              pre: ({ children }) => <pre className="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto">{children}</pre>,
              a: ({ href, children }) => <a href={href} className="text-blue-600 underline hover:text-blue-800">{children}</a>,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}

export default BlogPost;
