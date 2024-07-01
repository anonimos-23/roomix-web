import { Home, ShoppingBag, MessagesSquare, HelpCircle } from 'lucide-react'
import { ProfileCard } from './ProfileCard'

interface NavbarProps {
  logoPreview: string | null
  store_name: string
  slug: string
}

export function Navbar({ logoPreview, slug, store_name }: NavbarProps) {
  return (
    <div className="bg-zinc-800 h-[10%] px-12 flex justify-between items-center">
      <img
        src={logoPreview ? logoPreview : ''}
        alt={`${store_name} logo`}
        width={'10%'}
        height={'10%'}
      />
      <nav className="flex items-center gap-6">
        <a
          href={`/store/${slug}`}
          className="text-white flex items-center gap-2 font-normal tracking-wide hover:underline underline-offset-4 rounded-sm px-4 py-2"
        >
          <Home className="w-6 h-6 " />
          Início
        </a>

        <a
          href={`/store/${slug}/products`}
          className="text-white flex items-center gap-2 font-normal tracking-wide hover:underline underline-offset-4 rounded-sm px-4 py-2"
        >
          <ShoppingBag />
          Produtos
        </a>
        <a
          href={`/store/${slug}/faqs`}
          className="text-white flex items-center gap-2 font-normal tracking-wide hover:underline underline-offset-4 rounded-sm px-4 py-2"
        >
          <HelpCircle className="w-6 h-6 " />
          FAQs
        </a>
        {/* <a
            href={`/store/${slug}/chat`}
            className="text-white flex items-center gap-2 font-normal tracking-wide hover:underline underline-offset-4 rounded-sm px-4 py-2"
          >
            <MessagesSquare />
            Contacte-nos
          </a> */}
      </nav>
      <div>
        <ProfileCard slug={slug} />
      </div>
    </div>
  )
}
