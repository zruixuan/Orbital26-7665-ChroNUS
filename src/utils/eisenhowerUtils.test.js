import { describe, expect, test } from 'vitest'
import {
  isUrgent,
  isImportant,
  isUnimportant,
  classifyTask,
} from './eisenhowerUtils'

describe('Eisenhower priority classification', () => {
  const today = new Date('2026-07-26T00:00:00')

  test('classifies an important urgent task correctly', () => {
    const task = {
      importance: 'Important',
      deadline: '2026-07-28T00:00:00',
    }

    const result = classifyTask(task, 3, today)

    expect(result).toBe('important-urgent')
  })

  test('classifies an important non-urgent task correctly', () => {
    const task = {
      importance: 'Important',
      deadline: '2026-08-05T00:00:00',
    }

    const result = classifyTask(task, 3, today)

    expect(result).toBe('important-not-urgent')
  })

  test('classifies an unimportant urgent task correctly', () => {
    const task = {
      importance: 'Unimportant',
      deadline: '2026-07-27T00:00:00',
    }

    const result = classifyTask(task, 3, today)

    expect(result).toBe('not-important-urgent')
  })

  test('classifies an unimportant non-urgent task correctly', () => {
    const task = {
      importance: 'Unimportant',
      deadline: '2026-08-10T00:00:00',
    }

    const result = classifyTask(task, 3, today)

    expect(result).toBe('not-important-not-urgent')
  })

  test('treats an overdue task as urgent', () => {
    const task = {
      importance: 'Important',
      deadline: '2026-07-20T00:00:00',
    }

    expect(isUrgent(task, 3, today)).toBe(true)
  })

  test('recognises importance without case sensitivity', () => {
    const task = {
      importance: 'IMPORTANT',
    }

    expect(isImportant(task)).toBe(true)
    expect(isUnimportant(task)).toBe(false)
  })
})