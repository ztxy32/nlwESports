import { PrismaClient } from "@prisma/client"
import express from "express"
import cors from "cors"
import { ConvertHourStringToMinutes } from "./utils/covert-hour-string-to-minutes"
import { ConvertMinutesToHourString } from "./utils/covert-minutes-to-hour-string"

const app = express()

app.use(express.json())
app.use(cors())


const prisma = new PrismaClient()

app.get("/games", async(request, response) => {
    const games = await prisma.game.findMany({
        include: {
            _count: { select: { ads: true } }
        }
    })
    return response.json(games)
})

app.post("/games/:id/ads", async (request, response) => {
    const gameId = request.params.id
    const body: any = request.body

    const ad = await prisma.ad.create({
        data: {
            gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(","),
            hoursStart: ConvertHourStringToMinutes(body.hoursStart),
            hoursEnd: ConvertHourStringToMinutes(body.hoursEnd),
            usesVoiceChannel: body.usesVoiceChannel,
        }
    })

    return response.status(201).json(ad)
})

app.get("/games/:id/ads", async (request, response) => {
    const gameId = request.params.id
    const ads = await prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            usesVoiceChannel: true,
            yearsPlaying: true,
            hoursStart: true,
            hoursEnd: true,
        },
        where: { gameId },
        orderBy: { createdAt: "desc" }
    })

    return response.json(ads.map(item => {
        return {
            ...item, 
            weekDays: 
            item.weekDays.split(","),
            hoursStart: ConvertMinutesToHourString(item.hoursStart),
            hoursEnd: ConvertMinutesToHourString(item.hoursEnd)
        }
    }))
})

app.get("/ads/:id/discord", async (request, response) => {
    const adId = request.params.id

    const ad = await prisma.ad.findUniqueOrThrow({
        select: { discord: true },
        where: { id: adId }
    })

    return response.json({ discord: ad.discord})
})

app.listen(3333)