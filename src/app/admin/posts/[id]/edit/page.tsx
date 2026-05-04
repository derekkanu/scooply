import { notFound } from 'next/navigation'
import { getPostById } from '@/lib/data'
import { updatePostAction } from '@/lib/actions'
import PostForm from '@/components/PostForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params
  const post = await getPostById(id)
  if (!post) notFound()

  const action = updatePostAction.bind(null, id)

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Edit post</h1>
        <p className="text-sm text-zinc-500 mt-1 line-clamp-1">{post.title}</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <PostForm post={post} action={action} submitLabel="Save changes" />
      </div>
    </div>
  )
}
