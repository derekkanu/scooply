import { categories } from '@/lib/categories'
import type { Post } from '@/lib/types'
import Button from './ui/Button'
import Input from './ui/Input'
import Textarea from './ui/Textarea'
import Select from './ui/Select'

const SOURCE_OPTIONS = [
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'blog', label: 'Blog' },
]

interface PostFormProps {
  post?: Post
  action: (formData: FormData) => Promise<void>
  submitLabel: string
}

export default function PostForm({ post, action, submitLabel }: PostFormProps) {
  const defaultDate = post?.publishedAt
    ? new Date(post.publishedAt).toISOString().slice(0, 16)
    : new Date().toISOString().slice(0, 16)

  return (
    <form action={action} className="flex flex-col gap-5">
      <Input
        id="title"
        name="title"
        label="Title"
        placeholder="AI's Impact on Human Creativity"
        defaultValue={post?.title}
        required
      />

      <Textarea
        id="content"
        name="content"
        label="Content"
        placeholder="Paste the tweet, LinkedIn post, or article excerpt here..."
        defaultValue={post?.content}
        required
        className="min-h-[140px]"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Select
          id="source"
          name="source"
          label="Platform"
          options={SOURCE_OPTIONS}
          defaultValue={post?.source ?? 'twitter'}
        />
        <Select
          id="categoryId"
          name="categoryId"
          label="Category"
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          defaultValue={post?.categoryId ?? categories[0].id}
        />
      </div>

      <Input
        id="sourceUrl"
        name="sourceUrl"
        label="Source URL"
        type="url"
        placeholder="https://x.com/user/status/123"
        defaultValue={post?.sourceUrl}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          id="sourceHandle"
          name="sourceHandle"
          label="Handle / Author (optional)"
          placeholder="@username or Full Name"
          defaultValue={post?.sourceHandle}
        />
        <Input
          id="imageUrl"
          name="imageUrl"
          label="Image URL (optional)"
          type="url"
          placeholder="https://images.unsplash.com/..."
          defaultValue={post?.imageUrl}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          id="tags"
          name="tags"
          label="Tags (comma-separated)"
          placeholder="ai, creativity, design"
          defaultValue={post?.tags?.join(', ')}
        />
        <Input
          id="publishedAt"
          name="publishedAt"
          label="Published at"
          type="datetime-local"
          defaultValue={defaultDate}
          required
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-100">
        <a href="/admin/posts">
          <Button variant="secondary" type="button">Cancel</Button>
        </a>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}
