import axios from 'axios'
import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

export const tutorRouter = createTRPCRouter({
  tutorById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const tutor = await axios.get<TutorByIdResponse>(
        `http://localhost:5001/api/v1/tutor/${input.id}`
      )

      return {
        id: tutor.data.result.id,
        firstName: tutor.data.result.userDTO.firstName,
        lastName: tutor.data.result.userDTO.lastName,
        email: tutor.data.result.userDTO.email,
        description: tutor.data.result.description,
        subjects: tutor.data.result.subjectsDTO.map((subject) => subject.name),
        pricePerHour: tutor.data.result.pricePerHour,
        productImageUrl: tutor.data.result.productImageUrl,
        profileImageUrl: tutor.data.result.profileImageUrl,
      }
    }),
  tutors: publicProcedure.query(async () => {
    const tutors = await axios.get<TutorsResponse>(
      'http://localhost:5001/api/v1/tutor/'
    )

    return tutors.data.result.map((tutor) => ({
      id: tutor.id,
      firstName: tutor.userDTO.firstName,
      lastName: tutor.userDTO.lastName,
      email: tutor.userDTO.email,
      description: tutor.description,
      subjects: tutor.subjectsDTO.map((subject) => subject.name),
      pricePerHour: tutor.pricePerHour,
      productImageUrl: tutor.productImageUrl,
      profileImageUrl: tutor.profileImageUrl,
    }))
  }),
  schedulesByTutorId: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input }) => {
      const schedules = await axios.get<SchedulesByTutorIdResponse>(
        `http://localhost:5001/api/v1/schedule/tutor/${input.id}/available/`
      )

      return schedules.data.result.map((schedule) => ({
        id: schedule.id,
        date: schedule.date,
        start: schedule.startTime,
        end: schedule.endTime,
      }))
    }),
})

type TutorsResponse = {
  result: Array<{
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
      userTypeDTO: {
        id: number
        text: string
      }
    }
    subjectsDTO: Array<{
      id: number
      name: string
      tutorsDTO: Array<any>
    }>
  }>
}

type TutorByIdResponse = {
  result: {
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
      userTypeDTO: {
        id: number
        text: string
      }
    }
    subjectsDTO: Array<{
      id: number
      name: string
      tutorsDTO: Array<any>
    }>
  }
}

type SchedulesByTutorIdResponse = {
  result: Array<{
    id: number
    date: string
    startTime: string
    endTime: string
    userDTO: any
    tutorDTO: {
      id: number
      description: string
      pricePerHour: number
      productImageUrl: string
      profileImageUrl: string
    }
  }>
}
