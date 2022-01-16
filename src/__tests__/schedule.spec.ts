import { ScheduleElement, Schedule, TemporalExpression } from '../schedule'
import {
  OnDate,
  Or,
  Difference,
  Intersection,
  OnDayInMonth,
  DaysOfWeek,
} from '../temporal-expressions'

const JANURARY = 0

const SUNDAY = 0
const MONDAY = 1
const TUESDAY = 2
const WEDNESDAY = 3
const THURSDAY = 4
const FRIDAY = 5
const SATURDAY = 6

function formatDate(date: Date) {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}

test('it correctly determines an event for a number of days', () => {
  let schedule: Schedule = new Schedule()
  schedule.addScheduledElement(
    new ScheduleElement('running', new DaysOfWeek(MONDAY, WEDNESDAY, FRIDAY))
  )

  expect(
    schedule.isOccuring('running', new Date(2022, JANURARY, 3))
  ).toBeTruthy()
  expect(
    schedule.isOccuring('running', new Date(2022, JANURARY, 5))
  ).toBeTruthy()
  expect(
    schedule.isOccuring('running', new Date(2022, JANURARY, 4))
  ).toBeFalsy()
})

test('it correctly determines an event for a specific day', () => {
  let schedule: Schedule = new Schedule()
  const scheduledDate = new Date(2022, 1, 1)
  schedule.addScheduledElement(
    new ScheduleElement('running', new OnDate(scheduledDate))
  )

  expect(schedule.isOccuring('running', scheduledDate)).toBeTruthy()
  expect(schedule.isOccuring('running', new Date(2022, 1, 2))).toBeFalsy()
})

test('it correctly determines a day of event from beginning of month', () => {
  let schedule: Schedule = new Schedule()

  const secondMondayOfTheMonth = new OnDayInMonth(MONDAY, 2)
  schedule.addScheduledElement(
    new ScheduleElement('running', secondMondayOfTheMonth)
  )

  const theDate = new Date(2022, JANURARY, 10)
  expect(schedule.isOccuring('running', theDate)).toBeTruthy()
})

test('it correctly determines a day of event from end of month', () => {
  let schedule: Schedule = new Schedule()
  let LAST_WEEK_OF_MONTH = -1

  const lastFridayOfTheMonth = new OnDayInMonth(FRIDAY, LAST_WEEK_OF_MONTH)
  schedule.addScheduledElement(
    new ScheduleElement('running', lastFridayOfTheMonth)
  )
  const theDate = new Date(2022, JANURARY, 28)
  expect(schedule.isOccuring('running', theDate)).toBeTruthy()

  const secondToLastMonday = new OnDayInMonth(MONDAY, -2)
  schedule.addScheduledElement(
    new ScheduleElement('running', secondToLastMonday)
  )
  expect(
    schedule.isOccuring('running', new Date(2022, JANURARY, 24))
  ).toBeTruthy()
})

test('it correctly determines an Or expression ', () => {
  let schedule: Schedule = new Schedule()

  const secondMondayOfTheMonth = new OnDayInMonth(MONDAY, 2)
  const firstMondayOfTheMonth = new OnDate(new Date(2022, 1, 1))
  const expression = new Or(secondMondayOfTheMonth, firstMondayOfTheMonth)

  schedule.addScheduledElement(new ScheduleElement('running', expression))

  const theDate = new Date(2022, JANURARY, 10)
  expect(schedule.isOccuring('running', theDate)).toBeTruthy()
  expect(schedule.isOccuring('running', new Date(2022, 1, 1))).toBeTruthy()
  expect(schedule.isOccuring('running', new Date(2022, 1, 2))).toBeFalsy()
})

test('it correctly determines the different between two temporal expressions', () => {
  let schedule: Schedule = new Schedule()
  const jan1 = new Date(2022, JANURARY, 1)
  const onJan1 = new OnDate(jan1)
  const jan2 = new Date(2022, JANURARY, 2)
  const onJan2 = new OnDate(jan2)
  const onJan1OrJan2 = new Or(onJan1, onJan2)
  const difference = new Difference(
    onJan1OrJan2,
    new OnDate(new Date(2022, 0, 2))
  )

  schedule.addScheduledElement(new ScheduleElement('running', difference))

  expect(schedule.isOccuring('running', jan1)).toBeTruthy()
  expect(schedule.isOccuring('running', jan2)).toBeFalsy()
})

test('it correctly determines the intersection between two temporal expressions', () => {
  let schedule: Schedule = new Schedule()
  const jan1 = new Date(2022, 0, 1)
  const onJan1 = new OnDate(jan1)
  const jan2 = new Date(2022, 0, 2)
  const onJan2 = new OnDate(jan2)
  const onJan1OrJan2 = new Or(onJan1, onJan2)
  const difference = new Intersection(
    onJan1OrJan2,
    new OnDate(new Date(2022, 0, 2))
  )

  schedule.addScheduledElement(new ScheduleElement('running', difference))

  expect(schedule.isOccuring('running', jan2)).toBeTruthy()
  expect(schedule.isOccuring('running', jan1)).toBeFalsy()
})
