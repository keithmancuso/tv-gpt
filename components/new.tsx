import { Button } from '@/components/button'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/dialog'
import { Field, Label, FieldGroup } from '@/components/fieldset'
import { Input } from '@/components/input'
import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/20/solid'


export default function Example() {
  let [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>
        <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
        New Show
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Add a new show</DialogTitle>
     
        <DialogBody>
            <FieldGroup>
          <Field>
            <Label>Name</Label>
            <Input name="name" />
          </Field>
          <Field>
            <Label>App</Label>
            <Input name="app" />
          </Field>
          </FieldGroup>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}