"use client"

import { useCallback, useRef, useState } from "react"
import type z from "zod"

import { ServerAction } from "@/types/server-action"

/**
 * Custom hook to call a server action
 * @param {ServerAction<InputType, ResponseType>} action - The server action to call
 * @param {(data: ResponseType) => void} [onSuccess] - Callback to be called on successful response
 * @returns {Object} - Object containing the mutate function, response data, loading state and error
 */
export function useServerAction<
  InputType extends z.ZodTypeAny,
  ResponseType extends any
>(
  action: ServerAction<InputType, ResponseType>,
  onSuccess?: (data: ResponseType) => void
): {
  mutate: (input: z.infer<InputType>) => Promise<void>
  data: ResponseType | null
  isLoading: boolean
  error: Error | null
} {
  const doAction = useRef(action)

  const [data, setData] = useState<ResponseType | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [err, setErr] = useState<Error | null>(null)

  const mutate = useCallback(async (input: z.infer<InputType>) => {
    setIsLoading(true)
    setErr(null)
    setData(null)
    try {
      const result = await doAction.current(input)
      setData(result)
      setIsLoading(false)
      onSuccess && onSuccess(result)
    } catch (e) {
      setErr(e as Error)
      setIsLoading(false)
    }
  }, [])

  return {
    mutate,
    data,
    isLoading,
    error: err,
  }
}
