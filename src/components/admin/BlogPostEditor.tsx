
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import { blogAPI } from '../../lib/apis/blog';
import { Save, Image as ImageIcon, ArrowLeft } from 'lucide-react';

const BlogPostEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [status, setStatus] = useState<'draft' | 'published'>('draft');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditing);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditing && id) {
            fetchPost(id);
        }
    }, [id, isEditing]);

    const fetchPost = async (postId: string) => {
        const { data, error } = await blogAPI.getBlogPostById(postId);
        if (error) {
            setError('Error fetching post: ' + error.message);
        } else if (data) {
            setTitle(data.title);
            setContent(data.content);
            setExcerpt(data.excerpt || '');
            setStatus(data.status as 'draft' | 'published');
            setPreviewUrl(data.featured_image || null);
        }
        setInitialLoading(false);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEditing && id) {
                const { error } = await blogAPI.updateBlogPost(id, {
                    title,
                    content,
                    excerpt,
                    status,
                    image: imageFile || undefined
                });
                if (error) throw error;
            } else {
                const { error } = await blogAPI.createBlogPost({
                    title,
                    content,
                    excerpt,
                    status,
                    image: imageFile || undefined
                });
                if (error) throw error;
            }
            navigate('/admin/posts');
        } catch (err: any) {
            setError(err.message || 'Error saving post');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div className="p-8 text-center">Loading editor...</div>;

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow min-h-[calc(100vh-4rem)] flex flex-col">
            <div className="p-4 border-b border-stone-200 flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-lg">
                <div className="flex items-center space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/posts')}
                        className="text-stone-500 hover:text-stone-800"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-semibold text-stone-800">
                        {isEditing ? 'Edit Post' : 'New Post'}
                    </h2>
                </div>
                <div className="flex items-center space-x-3">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                        className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:ring-forest-500 focus:border-forest-500"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center space-x-2 bg-forest-600 text-white px-4 py-2 rounded-lg hover:bg-forest-700 transition-colors disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        <span>{loading ? 'Saving...' : 'Save'}</span>
                    </button>
                </div>
            </div>

            <div className="p-6 flex-1 space-y-6 overflow-y-auto">
                {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-lg font-medium"
                        placeholder="Post Title"
                        required
                    />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        {/* Rich Text Editor */}
                        <div className="h-96 pb-12">
                            <label className="block text-sm font-medium text-stone-700 mb-2">Content</label>
                            <ReactQuill
                                theme="snow"
                                value={content}
                                onChange={setContent}
                                className="h-full bg-white rounded-lg"
                            />
                        </div>

                        <div className="mt-12">
                            <label className="block text-sm font-medium text-stone-700 mb-2">Excerpt</label>
                            <textarea
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                                placeholder="Short summary for preview cards..."
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">Featured Image</label>
                            <div className="border-2 border-dashed border-stone-300 rounded-lg p-4 text-center hover:border-forest-500 transition-colors cursor-pointer relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                {previewUrl ? (
                                    <div className="relative">
                                        <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                            <ImageIcon className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-8">
                                        <ImageIcon className="w-12 h-12 text-stone-400 mx-auto mb-2" />
                                        <p className="text-sm text-stone-500">Click to upload image</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default BlogPostEditor;
