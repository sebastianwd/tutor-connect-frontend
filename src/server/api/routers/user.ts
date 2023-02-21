import axios from 'axios'
import { z } from 'zod'
import { env } from '~/env.mjs'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

export const userRouter = createTRPCRouter({
  saveSchedule: publicProcedure
    .input(
      z.object({
        id: z.number().int(),
        date: z.string(),
        start: z.string(),
        end: z.string(),
        userId: z.number().int(),
        tutorId: z.number().int(),
      })
    )
    .mutation(async ({ input }) => {
      await axios
        .put<any, any, SaveSchedulePayload>(
          `${env.API_URL}/api/v1/schedule/${input.id}`,
          {
            date: input.date,
            startTime: input.start,
            endTime: input.end,
            userDTO: {
              id: input.userId,
            },
            tutorDTO: {
              id: input.tutorId,
            },
          }
        )
        .catch((error) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          console.error(error?.response)

          throw new Error('Error')
        })

      return true
    }),

  schedulesByUserId: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input }) => {
      const schedules = await axios.get<SchedulesByUserId>(
        `${env.API_URL}/api/v1/schedule/student/${input.id}`
      )

      return schedules.data.result.map((schedule) => ({
        id: schedule.id,
        date: schedule.date,
        start: schedule.startTime,
        end: schedule.endTime,
        tutor: {
          id: schedule.tutorDTO.id,
          firstName: schedule.tutorDTO.userDTO.firstName,
          lastName: schedule.tutorDTO.userDTO.lastName,
          description: schedule.tutorDTO.description,
          pricePerHour: schedule.tutorDTO.pricePerHour,
          productImageUrl: schedule.tutorDTO.productImageUrl,
          profileImageUrl: schedule.tutorDTO.profileImageUrl,
        },
      }))
    }),
})

type SaveSchedulePayload = {
  date: string
  startTime: string
  endTime: string
  userDTO: {
    id: number
  }
  tutorDTO: {
    id: number
  }
}

type SchedulesByUserId = {
  result: Array<{
    id: number
    date: string
    startTime: string
    endTime: string
    userDTO: {
      id: number
      username: string
      password: string
      firstName: string
      lastName: string
      email: string
      userTypeDTO: {
        id: number
        text: string
      }
    }
    tutorDTO: {
      id: number
      description: string
      pricePerHour: number
      productImageUrl: string
      profileImageUrl: string
      userDTO: {
        id: number
        username: string
        password: string
        firstName: string
        lastName: string
        email: string
        userTypeDTO: any
      }
    }
  }>
}
