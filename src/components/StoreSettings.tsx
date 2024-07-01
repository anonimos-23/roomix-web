import { useState } from 'react'
import { Button } from './ui/button'
import { GeneralStoreSettingsForm } from './forms/store-settings-form'
import { ManageStoreIntegrations } from './manage-store-integrations'
import { ManageStorePages } from './manage-store-pages'
import { Layers, Workflow, Wrench } from 'lucide-react'

export function StoreSettings() {
  const [actualPage, setActualPage] = useState<
    'general' | 'integrations' | 'pages'
  >('general')

  return (
    <div className="flex gap-8 p-4 h-full">
      <aside className="flex flex-col gap-2">
        <Button
          onClick={() => setActualPage('general')}
          className="flex items-center gap-2 justify-start"
          variant={'outline'}
        >
          <Wrench className="w-4 h-4" />
          Geral
        </Button>
        <Button
          onClick={() => setActualPage('integrations')}
          className="flex items-center gap-2 justify-start"
          variant={'outline'}
        >
          <Workflow className="w-4 h-4" />
          Integrações
        </Button>
        <Button
          onClick={() => setActualPage('pages')}
          className="flex items-center gap-2 justify-start"
          variant={'outline'}
        >
          <Layers className="w-4 h-4" />
          Páginas
        </Button>
      </aside>
      <div className="w-full">
        {actualPage === 'general' && <GeneralStoreSettingsForm />}
        {actualPage === 'integrations' && <ManageStoreIntegrations />}
        {actualPage === 'pages' && <ManageStorePages />}
      </div>
    </div>
  )
}
