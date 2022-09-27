import "./styles/main.css"
import logoSvg from "./assets/Logo.svg"
import { GameBunner } from "./components/GameBanner"
import { CreateAdBanner } from "./components/CreateAdBanner"
import { useEffect, useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { CreateAdModal } from "./components/CreateAdModal"
import axios from "axios"

interface Game{
  id: string
  title: string
  bannerUrl: string
  _count: {
    ads: number
  }
}

function App() {
  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    axios("http://localhost:3333/games").then(response => {
        setGames(response.data)
      })
  })

  return (
    <div className="max-w-[1344px] mx-auto flex flex-col items-center my-20">
      <img src={logoSvg} alt="" />
      <h1 className="text-6xl text-white font-black mt-20">
        Seu <span className="bg-nlw-gradient bg-clip-text text-transparent">duo</span> está aqui.
      </h1>
      <div className="grid grid-cols-6 gap-6 mt-16">
        { games.map(item => 
          <GameBunner 
            title={item.title} 
            bannerUrl={item.bannerUrl} 
            adsCount={item._count.ads}
            key={item.id}
          />)
        }
      </div>

      <div className="pt-1 bg-nlw-gradient self-stretch rounded-lg overflow-hidden mt-8">
        <Dialog.Root>
          <CreateAdBanner/>
          <CreateAdModal/>
        </Dialog.Root>
      </div>
    </div>
  )
}

export default App
