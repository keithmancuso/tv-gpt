'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { Button } from '@/components/button'
import { deleteShow } from '@/app/lib/actions'

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    const formData = new FormData()
    formData.append('id', id)
    formData.append('path', '/')

    startTransition(async () => {
      await deleteShow(formData)
      router.refresh()
    })
  }

  return (
    <Button onClick={handleDelete} disabled={isPending} plain>
      <XMarkIcon className='size-4' />
    </Button>
  )
}