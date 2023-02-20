import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

export const tutorRouter = createTRPCRouter({
  tutorById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return {
        id: input.id,
        firstName: 'John',
        lastName: 'Doe',
        email: 'example@example.com',
        description: 'I am a tutor',
        subjects: ['Math', 'Science'],
        pricePerHour: 20,
        productImageUrl: 'https://picsum.photos/200',
        profileImageUrl: 'https://picsum.photos/200',
      }
    }),
  tutors: publicProcedure.query(() => {
    return [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        description: 'I am a tutor',
        subjects: ['Math', 'Science'],
        pricePerHour: 20,
        productImageUrl: 'https://picsum.photos/200',
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Doe',
        description: 'I am a tutor',
        subjects: ['Math', 'Science'],
        pricePerHour: 20,
        productImageUrl: 'https://picsum.photos/200',
      },
    ]
  }),
  schedulesByTutorId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return [
        {
          id: '1',
          day: 'Lunes',
          start: new Date(),
          end: new Date(),
        },
        {
          id: '2',
          day: 'Martes',
          start: new Date(),
          end: new Date(),
        },
      ]
    }),
})
