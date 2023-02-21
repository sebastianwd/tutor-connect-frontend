import { capitalize } from 'lodash'
import Link from 'next/link'
import * as React from 'react'
import { api } from '~/utils/api'
import { formatDateToDay } from '~/utils/format-date-hours'

const Tutorias = () => {
  const { data: schedules } = api.user.schedulesByUserId.useQuery({ id: 1 })

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-900 text-white">
      <header className="mb-6">
        <nav className="border-gray-200 bg-white px-4 py-2.5 dark:bg-gray-800 lg:px-6">
          <div className="mx-auto flex max-w-screen-xl flex-col flex-wrap items-center justify-between">
            <Link href="/" className="mb-3 flex items-center">
              <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                TutorConnect
              </span>
            </Link>
            <div className="w-full items-center justify-between lg:order-1 lg:flex lg:w-auto">
              <ul className="mt-4 flex flex-col font-medium lg:mt-0 lg:flex-row lg:space-x-8">
                <li>
                  <Link
                    href="/"
                    className="lg:hover:text-primary-700 block border-b border-gray-100 py-2 pr-4 pl-3 text-gray-400 hover:bg-gray-50 dark:border-gray-700  dark:hover:bg-gray-700 dark:hover:text-white lg:border-0 lg:p-0 lg:hover:bg-transparent lg:dark:hover:bg-transparent lg:dark:hover:text-white"
                  >
                    Tutores
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tutorias"
                    className="lg:hover:text-primary-700 block border-b border-gray-100 py-2 pr-4 pl-3 text-white hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white lg:border-0 lg:p-0 lg:hover:bg-transparent lg:dark:hover:bg-transparent lg:dark:hover:text-white"
                  >
                    Mis Tutorías
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      {schedules?.map((schedule) => (
        <Link
          href={`/tutor/${schedule.tutor.id}`}
          className="min-w-[50%] rounded bg-gray-700 p-4"
          key={schedule.id}
        >
          <div className="mb-4 flex items-center space-x-4">
            <img
              src={schedule.tutor.profileImageUrl}
              alt={schedule.tutor.firstName}
              className="h-20 w-20 rounded-full"
            />

            <p>{schedule.tutor.firstName + ' ' + schedule.tutor.lastName}</p>
          </div>
          <p>
            {capitalize(formatDateToDay(new Date(schedule?.date)))}
            {', '}
            {schedule?.start} - {schedule?.end}
          </p>
        </Link>
      ))}
    </main>
  )
}

export default Tutorias
