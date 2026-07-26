const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24

export function isUrgent(task, urgentDays, today = new Date()) {
  const deadline = new Date(task.deadline)
  const diffTime = deadline.getTime() - today.getTime()
  const diffDays = diffTime / MILLISECONDS_PER_DAY

  return diffDays <= urgentDays
}

export function isImportant(task) {
  return task.importance?.toLowerCase() === 'important'
}

export function isUnimportant(task) {
  return task.importance?.toLowerCase() === 'unimportant'
}

export function classifyTask(task, urgentDays, today = new Date()) {
  const important = isImportant(task)
  const urgent = isUrgent(task, urgentDays, today)

  if (important && urgent) {
    return 'important-urgent'
  }

  if (important && !urgent) {
    return 'important-not-urgent'
  }

  if (!important && urgent) {
    return 'not-important-urgent'
  }

  return 'not-important-not-urgent'
}