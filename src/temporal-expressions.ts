import { endOfMonth } from 'date-fns'
import { TemporalExpression } from './schedule'

export class DaysOfWeek implements TemporalExpression {
  readonly daysOfWeek: number[]

  constructor(...daysOfWeek: number[]) {
    this.daysOfWeek = daysOfWeek
  }

  includes(theDate: Date): boolean {
    const dayOfWeek = theDate.getDay()
    return this.daysOfWeek.some((d) => d === dayOfWeek)
  }
}

export class OnDate implements TemporalExpression {
  readonly onDate: Date

  constructor(date: Date) {
    this.onDate = date
  }

  includes(theDate: Date): boolean {
    return (
      this.onDate.getFullYear() === theDate.getFullYear() &&
      this.onDate.getMonth() === theDate.getMonth() &&
      this.onDate.getDate() === theDate.getDate()
    )
  }
}

export class Difference implements TemporalExpression {
  readonly included: TemporalExpression
  readonly excluded: TemporalExpression

  constructor(included: TemporalExpression, excluded: TemporalExpression) {
    this.included = included
    this.excluded = excluded
  }

  includes(theDate: Date): boolean {
    return this.included.includes(theDate) && !this.excluded.includes(theDate)
  }
}

export class Or implements TemporalExpression {
  readonly expressions: TemporalExpression[]

  constructor(...expressions: TemporalExpression[]) {
    this.expressions = expressions
  }

  includes(theDate: Date): boolean {
    for (const expression of this.expressions) {
      if (expression.includes(theDate)) {
        return true
      }
    }

    return false
  }
}

export class Intersection implements TemporalExpression {
  readonly expressions: TemporalExpression[]

  constructor(...expressions: TemporalExpression[]) {
    this.expressions = expressions
  }

  includes(theDate: Date): boolean {
    for (const expression of this.expressions) {
      if (!expression.includes(theDate)) {
        return false
      }
    }

    return true
  }
}

export class OnDayInMonth implements TemporalExpression {
  readonly dayOfWeek: number
  readonly count: number

  constructor(dayOfWeek: number, count: number) {
    this.dayOfWeek = dayOfWeek
    this.count = count
  }

  includes(theDate: Date): boolean {
    return this.dayMatches(theDate) && this.weekMatches(theDate)
  }

  private dayMatches(date: Date) {
    return date.getDay() === this.dayOfWeek
  }

  private weekMatches(date: Date) {
    if (this.count > 0) {
      return this.weekFromStartMatches(date)
    } else {
      return this.weekFromEndMatches(date)
    }
  }

  private weekFromStartMatches(date: Date) {
    return this.weekInMonth(date.getDate()) === this.count
  }

  private weekFromEndMatches(date: Date) {
    const daysFromMonthEnd = this.daysLeftInMonth(date) + 1
    return this.weekInMonth(daysFromMonthEnd) == Math.abs(this.count)
  }

  private daysLeftInMonth(date: Date) {
    return endOfMonth(date).getDate() - date.getDate()
  }

  private weekInMonth(dayNumber: number) {
    return Math.round((dayNumber - 1) / 7) + 1
  }
}
