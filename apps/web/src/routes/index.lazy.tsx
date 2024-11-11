import { createLazyFileRoute } from '@tanstack/react-router'

import { Greet } from '../components/greet'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className='p-2'>
      <Greet />
    </div>
  )
}
