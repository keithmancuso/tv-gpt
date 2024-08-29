'use client'

import { Button } from '@/components/button'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/dialog'
import { Field, Label, FieldGroup } from '@/components/fieldset'
import { Input } from '@/components/input'
import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/20/solid'

import { createShow } from '@/app/lib/actions';

export default function Example() {
  let [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  const handleSearch = async (value: string) => {
    if (value.length < 2) return
    try {
      const response = await fetch(`/api/tvdb-search?query=${encodeURIComponent(value)}`)
      const data = await response.json()
      setSuggestions(data.data.slice(0, 5))
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    }
  }

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>
        <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
        New Show
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Add a new show</DialogTitle>
        <form action={createShow}>
        <DialogBody>
          
            <FieldGroup>
          <Field>
            <Label>Name</Label>
            <Input
              name="name"
              type="text"
              autoComplete="off"
           
            />
          
          </Field>
          <Field>
            <Label>App</Label>
            <Input name="app" />
          </Field>
          </FieldGroup>
         
        </DialogBody>
        <DialogActions>
          <Button  plain onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type='submit' onClick={() => setIsOpen(false)}>Add</Button>
        </DialogActions>
        </form>
      </Dialog>
    </>
  )
}