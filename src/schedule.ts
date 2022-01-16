/**
 * Typescript implementation of https://martinfowler.com/apsupp/recurring.pdf
 */

export interface TemporalExpression {
  includes(theDate: Date): boolean
}

export class ScheduleElement {
  readonly temporalExpression: TemporalExpression
  readonly event: string

  constructor(event: string, temporalExpression: TemporalExpression) {
    this.event = event
    this.temporalExpression = temporalExpression
  }

  isOccuring(event: string, date: Date) {
    if (this.event !== event) {
      return false
    }
    return this.temporalExpression.includes(date)
  }
}

export class Schedule {
  private readonly scheduledElements: ScheduleElement[] = []

  isOccuring(event: string, date: Date) {
    for (let scheduledElement of this.scheduledElements) {
      if (scheduledElement.isOccuring(event, date)) {
        return true
      }
    }
    return false
  }

  addScheduledElement(element: ScheduleElement) {
    this.scheduledElements.push(element)
  }
}
