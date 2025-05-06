"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

export function DatabaseStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [message, setMessage] = useState<string>("")
  const [tables, setTables] = useState<string[]>([])

  useEffect(() => {
    async function checkStatus() {
      try {
        const response = await fetch("/api/db-status")
        const data = await response.json()

        if (response.ok) {
          setStatus(data.status)
          setMessage(data.message)
          setTables(data.tables || [])
        } else {
          setStatus("error")
          setMessage(data.message || "Failed to connect to the database")
        }
      } catch (error) {
        setStatus("error")
        setMessage("Error checking database status")
        console.error("Error checking database status:", error)
      }
    }

    checkStatus()
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Database Status
          {status === "loading" ? (
            <Badge variant="outline" className="flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Checking...
            </Badge>
          ) : status === "connected" ? (
            <Badge variant="success" className="bg-green-500 text-white">
              Connected
            </Badge>
          ) : (
            <Badge variant="destructive">Error</Badge>
          )}
        </CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent>
        {status === "connected" && tables.length > 0 ? (
          <div>
            <p className="text-sm font-medium mb-2">Available Tables:</p>
            <div className="grid grid-cols-2 gap-2">
              {tables.map((table) => (
                <Badge key={table} variant="outline" className="justify-start">
                  {table}
                </Badge>
              ))}
            </div>
          </div>
        ) : status === "connected" ? (
          <p className="text-sm text-muted-foreground">No tables found in the database.</p>
        ) : status === "error" ? (
          <p className="text-sm text-destructive">
            Could not connect to the database. Please check your connection string.
          </p>
        ) : (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default DatabaseStatus
