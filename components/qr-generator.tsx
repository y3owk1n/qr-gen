"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { generateQrCode } from "@/lib/server-actions"
import { useServerAction } from "@/hooks/useServerAction"

import { Button, buttonVariants } from "./ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"
import { Separator } from "./ui/separator"
import { toast } from "./ui/use-toast"

export const qrGenFormSchema = z.object({
  input: z.string().min(2).max(50),
  scale: z.number().min(1).max(100),
})

export function QrGenerator() {
  const form = useForm<z.infer<typeof qrGenFormSchema>>({
    resolver: zodResolver(qrGenFormSchema),
    defaultValues: {
      input: "",
      scale: 4,
    },
  })

  const {
    data: generateQRCodeData,
    mutate: generateQrCodeMutation,
    isLoading: generateQrCodeLoading,
    error: generateQrCodeError,
  } = useServerAction(generateQrCode, () => {
    toast({
      title: "Success",
      description: "QR Code generated.",
    })

    form.reset()
  })

  async function onSubmit(values: z.infer<typeof qrGenFormSchema>) {
    await generateQrCodeMutation(values)
  }

  return (
    <div className="grid gap-8 py-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="input"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Input</FormLabel>
                <FormControl>
                  <Input
                    disabled={generateQrCodeLoading}
                    placeholder="Any input to generate QR Code"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scale"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Scale</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    disabled={generateQrCodeLoading}
                    placeholder="Scale of the qr code"
                    {...field}
                    onChange={(event) =>
                      field.onChange(Number(event.target.value))
                    }
                  />
                </FormControl>
                <FormDescription>
                  Scale factor. A value of 1 means 1px per modules (black dots).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {generateQrCodeError && (
            <p className="px-1 text-xs text-red-500">aoheusaohesutaoeuh</p>
          )}
          <Button type="submit" disabled={generateQrCodeLoading}>
            {generateQrCodeLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Generate
          </Button>
        </form>
      </Form>
      {generateQRCodeData && (
        <div className="grid gap-4">
          <Separator />
          <img src={generateQRCodeData} className="h-full w-full" />
          <p className="text-sm text-muted-foreground">
            Click the button below to download
          </p>
          <a
            className={buttonVariants({ variant: "outline" })}
            href={generateQRCodeData}
            download
          >
            Download QR Code
          </a>
        </div>
      )}
    </div>
  )
}
