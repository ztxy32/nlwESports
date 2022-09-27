import { Check, GameController } from "phosphor-react"
import { Input } from "./Form/Input"
import * as Checkbox from "@radix-ui/react-checkbox"
import * as ToggleGroup from "@radix-ui/react-toggle-group"
import * as Dialog from "@radix-ui/react-dialog"
import { FormEvent, useEffect, useState } from "react"
import axios from "axios"

interface Game{
  id: string
  title: string
}

export function CreateAdModal(){
  const [games, setGames] = useState<Game[]>([])
  const [weekDays, setWeekDays] = useState<string[]>([])
  const [usesVoiceChannel, setUsesVoiceChannel] = useState(false)

  useEffect(() => {
    axios("http://localhost:3333/games").then(response => {
        setGames(response.data)
      })
  })

  async function handleCreateAd(event: FormEvent){
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement)
    const data = Object.fromEntries(formData)
    console.log(data.game)

    try{
      await axios.post(`http://localhost:3333/games/${data.game}/ads`, {
        name: data.name,
        yearsPlaying: Number(data.yearsPlaying),
        discord: data.discord,
        weekDays: weekDays,
        hoursStart: data.hoursStart,
        hoursEnd: data.hoursEnd,
        usesVoiceChannel: usesVoiceChannel
      })
      alert("Anúncio criado com sucesso!")
    }catch(err){
      console.log(err)
      alert("erro ao criar o anúncio")
    }
  }

  return(
      <Dialog.Portal>
          <Dialog.Overlay className="bg-black/60 inset-0 fixed"/>
          <Dialog.Content className="fixed bg-[#2a2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25">
            <Dialog.Title className="text-3xl font-black">Publique um anúncio</Dialog.Title>
              
              <form className="mt-8 flex flex-col gap-4" onSubmit={handleCreateAd}>
                <div className="flex flex-col gap-2">
                  <label htmlFor="game" className="font-semibold">Qual o game?</label>
                  <select 
                    id="game"
                    name="game"
                    className="bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500 appearance-none"
                    defaultValue=""
                  >
                    <option disabled value="" >Seleccione o game que desejas jogar</option>
                    {games.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="name">Teu nome(ou nick)</label>
                  <Input id="name" name="name" placeholder="Como te chamam dentro do jogo?"/>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="yearsPlaying">Há quantos anos jogas?</label>
                    <Input id="yearsPlaying" name="yearsPlaying" type="number" placeholder="Tudo bem ser ZERO"/>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="discord">Qual teu discord?</label>
                    <Input id="discord" name="discord" placeholder="Usuário#0000" />
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex flex-col gap-2 flex-1">
                    <label htmlFor="weekDays">Quando costumas jogar?</label>
                    <ToggleGroup.Root 
                      type="multiple" 
                      className="grid grid-cols-4 gap-2"
                      onValueChange={setWeekDays}
                      value={weekDays}
                    >
                      <ToggleGroup.Item 
                        value="0"
                        title="Domingo"
                        className={`w-8 h-8 rounded ${weekDays.includes("0") ? "bg-violet-500" : "bg-zinc-900"}`}
                      >D</ToggleGroup.Item>
                      <ToggleGroup.Item 
                        value="1"
                        title="Segunda"
                        className={`w-8 h-8 rounded ${weekDays.includes("1") ? "bg-violet-500" : "bg-zinc-900"}`}
                      >S</ToggleGroup.Item>
                      <ToggleGroup.Item
                        value="2"
                        title="Terça"
                        className={`w-8 h-8 rounded ${weekDays.includes("2") ? "bg-violet-500" : "bg-zinc-900"}`}
                      >T</ToggleGroup.Item>
                      <ToggleGroup.Item 
                        value="3"
                        title="Quarta"
                        className={`w-8 h-8 rounded ${weekDays.includes("3") ? "bg-violet-500" : "bg-zinc-900"}`}
                      >Q</ToggleGroup.Item>
                      <ToggleGroup.Item 
                        value="4"
                        title="Quinta"
                        className={`w-8 h-8 rounded ${weekDays.includes("4") ? "bg-violet-500" : "bg-zinc-900"}`}
                      >Q</ToggleGroup.Item>
                      <ToggleGroup.Item 
                        value="5"
                        title="Sexta"
                        className={`w-8 h-8 rounded ${weekDays.includes("5") ? "bg-violet-500" : "bg-zinc-900"}`}
                      >S</ToggleGroup.Item>
                      <ToggleGroup.Item 
                        value="6"
                        title="Sábado"
                        className={`w-8 h-8 rounded ${weekDays.includes("6") ? "bg-violet-500" : "bg-zinc-900"}`}
                      >S</ToggleGroup.Item>
                    </ToggleGroup.Root>
                  </div>
                  <div>
                    <label htmlFor="hoursStart">Qual horário do dia?</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input id="hoursStart" name="hoursStart" type="time" placeholder="De"/>
                      <Input id="hoursEnd" name="hoursEnd" type="time" placeholder="Até"/>
                    </div>
                  </div>
                </div>
                <label className="mt-2 flex items-center gap-2 text-sm">
                  <Checkbox.Root 
                    className="w-6 h-6 p-1 rounded bg-zinc-900" 
                    checked={usesVoiceChannel}
                    onCheckedChange={(checked) => {
                      if (checked === true) {
                        setUsesVoiceChannel(true)
                      }else{
                        setUsesVoiceChannel(false)
                      }
                      }}
                    >
                    <Checkbox.Indicator>
                      <Check className="w-4 h-4 text-emerald-400"/>
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  Costumo conectar-me ao chat de voz
                </label>
                <footer className="mt-4 flex justify-end gap-4">
                  <Dialog.Close 
                    className="bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600"
                  >Cancelar</Dialog.Close>
                  <button 
                    type="submit" 
                    className="bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600"
                  >
                    <GameController size={24}/> Encontrar duo
                  </button>
                </footer>
              </form>
          </Dialog.Content>
        </Dialog.Portal>
  )
}