"use server"

import QRCode from "qrcode"
import { z } from "zod"

import { serverValidate } from "@/types/server-action"

const qrGenFormSchema = z.object({
  input: z.string().min(2).max(50),
  scale: z.number().min(1).max(100),
})

export const generateQrCode = serverValidate(qrGenFormSchema)(
  async ({ input, scale }) => {
    try {
      const generated = await QRCode.toDataURL(input, {
        margin: 2,
        scale,
      })

      return generated
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message)
    }
    return
  }
)
