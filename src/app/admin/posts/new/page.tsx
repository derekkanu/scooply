import { createPostAction } from '@/lib/actions'
import PostForm from '@/components/PostForm'

export default function NewPostPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">New post</h1>
        <p className="text-sm text-zinc-500 mt-1">Add a new piece of AI content to the feed.</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <PostForm action={createPostAction} submitLabel="Publish post" />
      </div>
    </div>
  )
}
