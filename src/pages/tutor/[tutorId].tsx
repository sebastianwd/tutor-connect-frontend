/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useRouter } from 'next/router'
import * as React from 'react'
import { api } from '~/utils/api'
import { capitalize, isNil } from 'lodash'
import { formatDateToDay } from '~/utils/format-date-hours'
import axios from 'axios'
import { env } from '~/env.mjs'

const USER_ID = 1

const TutorDetail = () => {
  const router = useRouter()

  const tutorId = router.query.tutorId as string

  const [message, setMessage] = React.useState<string>('')

  const [messageList, setMessageList] = React.useState<string[]>([])

  const { data: tutor } = api.tutor.tutorById.useQuery(
    { id: tutorId },
    { enabled: !isNil(tutorId) }
  )

  const [selectedSchedule, setSelectedSchedule] = React.useState<{
    id: number
  } | null>(null)

  const { data: schedules } = api.tutor.schedulesByTutorId.useQuery(
    {
      id: Number(tutorId),
    },
    { enabled: !isNil(tutorId) }
  )

  const { mutateAsync: saveSchedule } = api.user.saveSchedule.useMutation()

  const chatId = Number(`${tutorId}${USER_ID}`)

  const onSaveSchedule = async () => {
    const schedule = schedules?.find((s) => s.id === selectedSchedule?.id)
    if (schedule && tutor) {
      try {
        await saveSchedule({
          id: schedule.id,
          date: schedule.date,
          tutorId: tutor.id,
          userId: 1,
          end: schedule.end,
          start: schedule.start,
        })
        alert('Tutoría agendada')
      } catch (error) {
        console.log(error)
      }
    }
  }

  const onSendMessage = async () => {
    await axios.post(`${env.NEXT_PUBLIC_API_URL}/api/chat`, message, {
      headers: {
        'Content-Type': 'text/plain',
      },
      params: {
        chatId,
      },
    })

    setMessage('')
  }
  React.useEffect(() => {
    const source = new EventSource(
      `${env.NEXT_PUBLIC_API_URL}/api/chat?chatId=${chatId}`
    )
    source.addEventListener('message', function (event: MessageEvent<string>) {
      if (!messageList.includes(event.data)) {
        setMessageList((prev) => [...prev, event.data])
      }
    })
    return () => {
      source.close()
    }
  }, [messageList, chatId])

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-900 py-6 text-gray-300">
      <div className="my-auto flex min-w-[50%] flex-col gap-10 md:w-[50%] md:flex-row">
        <div className="basis-1/2 overflow-hidden rounded-lg bg-gray-800 text-gray-300 shadow-lg ">
          <img
            className="h-56 w-full object-cover object-center"
            src={tutor?.productImageUrl}
            alt="avatar"
          />

          <div className="py-4 px-6">
            <div className="flex items-center gap-4">
              <img
                className="h-24 w-24
               rounded-full object-cover object-center"
                src={tutor?.profileImageUrl}
                alt="avatar"
              />
              <h1 className="text-2xl font-semibold">
                {`${tutor?.firstName} ${tutor?.lastName}`}
              </h1>
            </div>
            <p className="py-2 text-lg">{tutor?.description}</p>
            <div className="mt-4 flex items-center ">
              <svg className="h-6 w-6 fill-current" viewBox="0 0 512 512">
                <path d="M239.208 343.937c-17.78 10.103-38.342 15.876-60.255 15.876-21.909 0-42.467-5.771-60.246-15.87C71.544 358.331 42.643 406 32 448h293.912c-10.639-42-39.537-89.683-86.704-104.063zM178.953 120.035c-58.479 0-105.886 47.394-105.886 105.858 0 58.464 47.407 105.857 105.886 105.857s105.886-47.394 105.886-105.857c0-58.464-47.408-105.858-105.886-105.858zm0 186.488c-33.671 0-62.445-22.513-73.997-50.523H252.95c-11.554 28.011-40.326 50.523-73.997 50.523z" />
                <g>
                  <path d="M322.602 384H480c-10.638-42-39.537-81.691-86.703-96.072-17.781 10.104-38.343 15.873-60.256 15.873-14.823 0-29.024-2.654-42.168-7.49-7.445 12.47-16.927 25.592-27.974 34.906C289.245 341.354 309.146 364 322.602 384zM306.545 200h100.493c-11.554 28-40.327 50.293-73.997 50.293-8.875 0-17.404-1.692-25.375-4.51a128.411 128.411 0 0 1-6.52 25.118c10.066 3.174 20.779 4.862 31.895 4.862 58.479 0 105.886-47.41 105.886-105.872 0-58.465-47.407-105.866-105.886-105.866-37.49 0-70.427 19.703-89.243 49.09C275.607 131.383 298.961 163 306.545 200z" />
                </g>
              </svg>
              <h1 className="px-2 text-sm">{tutor?.subjects.join(', ')}</h1>
            </div>
            <div className="mt-4 flex items-center">
              <svg className="h-6 w-6 fill-current" viewBox="0 0 512 512">
                <path d="M437.332 80H74.668C51.199 80 32 99.198 32 122.667v266.666C32 412.802 51.199 432 74.668 432h362.664C460.801 432 480 412.802 480 389.333V122.667C480 99.198 460.801 80 437.332 80zM432 170.667L256 288 80 170.667V128l176 117.333L432 128v42.667z" />
              </svg>
              <h1 className="px-2 text-sm">{tutor?.email}</h1>
            </div>
            <div className="mt-4 flex flex-col items-center">
              <h6 className="mb-2">
                {(schedules?.length || 0) > 0
                  ? 'Horarios disponibles'
                  : 'No hay horarios disponibles'}
              </h6>
              <ul className="rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                {schedules?.map((schedule) => {
                  const isScheduleSelected =
                    schedule?.id === selectedSchedule?.id

                  return (
                    <li
                      className={`w-full cursor-pointer border-b border-gray-200 px-4 py-2 dark:border-gray-600 ${
                        isScheduleSelected ? 'bg-blue-100 dark:bg-blue-800' : ''
                      }`}
                      key={schedule?.id}
                      onClick={() => {
                        if (isScheduleSelected) {
                          setSelectedSchedule(null)
                          return
                        }

                        setSelectedSchedule({ id: schedule.id })
                      }}
                    >
                      {capitalize(formatDateToDay(new Date(schedule?.date)))}
                      {', '}
                      {schedule?.start} - {schedule?.end}
                    </li>
                  )
                })}
              </ul>
              <div className="mt-2 flex w-full flex-col items-center space-y-3 p-4">
                <button
                  type="button"
                  disabled={!selectedSchedule}
                  className="mr-2 mb-2 w-fit rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600
                   dark:hover:bg-blue-700 dark:focus:ring-blue-800
                  "
                  onClick={() => void onSaveSchedule()}
                >
                  Programar tutoría
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex max-h-[80vh] min-h-[50vh] flex-grow basis-1/2 flex-col overflow-hidden rounded-lg bg-gray-800 shadow-xl ">
          <div className="flex h-0 flex-grow flex-col overflow-auto p-4">
            {/*<div className="mt-2 flex w-full max-w-xs space-x-3">
              <div>
                <div className="rounded-r-lg rounded-bl-lg bg-gray-600 p-3">
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </div>
              </div>
              </div>*/}
            {messageList?.map((message, index) => {
              return (
                <div
                  className="mt-2 ml-auto flex w-full max-w-xs justify-end space-x-3"
                  key={index}
                >
                  <div>
                    <div className="rounded-l-lg rounded-br-lg bg-gray-900 p-3 text-white">
                      <p className="text-sm">{message}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex bg-gray-300 p-4">
            <input
              className="flex h-10 w-full items-center rounded px-3 text-sm"
              type="text"
              placeholder="Type your message…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="button"
              className="mr-2 mb-2 w-fit rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600
                   dark:hover:bg-blue-700 dark:focus:ring-blue-800
                  "
              onClick={() => void onSendMessage()}
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default TutorDetail
