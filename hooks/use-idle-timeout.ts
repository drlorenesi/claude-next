"use client"

import { useEffect, useRef, useCallback } from "react"

const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
] as const

interface UseIdleTimeoutOptions {
  timeout: number
  warningMs?: number
  onWarn: () => void
  onTimeout: () => void
}

export function useIdleTimeout({
  timeout,
  warningMs = 2 * 60 * 1000,
  onWarn,
  onTimeout,
}: UseIdleTimeoutOptions) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const warnRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const warnFired = useRef(false)

  const reset = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (warnRef.current) clearTimeout(warnRef.current)
    warnFired.current = false

    warnRef.current = setTimeout(() => {
      warnFired.current = true
      onWarn()
    }, timeout - warningMs)

    timeoutRef.current = setTimeout(onTimeout, timeout)
  }, [timeout, warningMs, onWarn, onTimeout])

  useEffect(() => {
    reset()

    const handleActivity = () => {
      if (!warnFired.current) reset()
    }

    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, handleActivity))

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (warnRef.current) clearTimeout(warnRef.current)
      ACTIVITY_EVENTS.forEach((e) =>
        window.removeEventListener(e, handleActivity)
      )
    }
  }, [reset])

  return { reset }
}
