type AnyFunction<TArgs extends unknown[] = unknown[]> = (...args: TArgs) => void

export interface Cancelable<TArgs extends unknown[]> {
  (...args: TArgs): void
  cancel: () => void
}

export const throttle = <TArgs extends unknown[]>(
  callback: AnyFunction<TArgs>,
  waitMs = 100,
): Cancelable<TArgs> => {
  let lastInvoke = 0
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let trailingArgs: TArgs | null = null

  const invoke = (args: TArgs) => {
    lastInvoke = Date.now()
    callback(...args)
  }

  const throttled = (...args: TArgs) => {
    const now = Date.now()
    const elapsed = now - lastInvoke

    if (elapsed >= waitMs) {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }

      trailingArgs = null
      invoke(args)
      return
    }

    trailingArgs = args

    if (timeoutId) {
      return
    }

    timeoutId = setTimeout(() => {
      timeoutId = null

      if (!trailingArgs) {
        return
      }

      invoke(trailingArgs)
      trailingArgs = null
    }, waitMs - elapsed)
  }

  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    trailingArgs = null
  }

  return throttled
}

export const debounce = <TArgs extends unknown[]>(
  callback: AnyFunction<TArgs>,
  waitMs = 150,
): Cancelable<TArgs> => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const debounced = (...args: TArgs) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      timeoutId = null
      callback(...args)
    }, waitMs)
  }

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return debounced
}
