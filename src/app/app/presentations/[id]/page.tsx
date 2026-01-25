import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PresentationEditor } from './PresentationEditor'

export default async function EditPresentationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: presentation, error } = await supabase
    .from('presentations')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !presentation) {
    notFound()
  }

  const { data: slides } = await supabase
    .from('slides')
    .select('*')
    .eq('presentation_id', id)
    .order('position', { ascending: true })

  return (
    <PresentationEditor
      presentation={presentation}
      initialSlides={slides || []}
    />
  )
}
