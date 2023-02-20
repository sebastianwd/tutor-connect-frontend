import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

const messages = new Map<string, { message: string }[]>()

export const chatRouter = createTRPCRouter({
  sendMessage: publicProcedure
    .input(z.object({ message: z.string(), chatId: z.string() }))
    .mutation(({ input }) => {
      const chatMessages = messages.get(input.chatId)

      if (!chatMessages) {
        messages.set(input.chatId, [{ message: input.message }])
      } else {
        chatMessages.push({ message: input.message })
      }

      return { message: input.message }
    }),
  getMessages: publicProcedure
    .input(z.object({ chatId: z.string() }))
    .query(({ input }) => {
      return messages.get(input.chatId) ?? []
    }),
})
