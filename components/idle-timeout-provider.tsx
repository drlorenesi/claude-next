"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/auth-client"
import { useIdleTimeout } from "@/hooks/use-idle-timeout"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

// const IDLE_TIMEOUT = 10 * 1000 // 10 seconds
// const WARNING_MS = 8 * 1000 // 8 seconds before timeout
const IDLE_TIMEOUT = 60 * 60 * 1000 // 60 minutes
const WARNING_MS = 2 * 60 * 1000 // 2 minutes before timeout

export function IdleTimeoutProvider() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(WARNING_MS / 1000)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
    }
  }, [])

  const handleTimeout = useCallback(async () => {
    stopCountdown()
    setOpen(false)
    await signOut()
    router.push("/login?expirado=true")
  }, [router, stopCountdown])

  const handleWarn = useCallback(() => {
    setSecondsLeft(WARNING_MS / 1000)
    setOpen(true)
    countdownRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          stopCountdown()
          return 0
        }
        return s - 1
      })
    }, 1000)
  }, [stopCountdown])

  const { reset } = useIdleTimeout({
    timeout: IDLE_TIMEOUT,
    warningMs: WARNING_MS,
    onWarn: handleWarn,
    onTimeout: handleTimeout,
  })

  const handleContinue = useCallback(() => {
    stopCountdown()
    setOpen(false)
    reset()
  }, [reset, stopCountdown])

  const handleSignOutNow = useCallback(async () => {
    stopCountdown()
    setOpen(false)
    await signOut()
    router.push("/login")
  }, [router, stopCountdown])

  useEffect(() => {
    return () => stopCountdown()
  }, [stopCountdown])

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sesión por expirar</AlertDialogTitle>
          <AlertDialogDescription>
            Por inactividad, tu sesión se cerrará en{" "}
            <span className="font-semibold text-foreground">{secondsLeft}</span>{" "}
            {secondsLeft === 1 ? "segundo" : "segundos"}. ¿Deseas continuar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={handleSignOutNow}>
            Cerrar sesión ahora
          </Button>
          <Button onClick={handleContinue}>Continuar sesión</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
