"use client"

import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, createContext, useContext } from "react"

const ToastContext = createContext({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
})

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = (toast) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, ...toast }])

    // Auto dismiss
    if (toast.duration !== Number.POSITIVE_INFINITY) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration || 3000)
    }
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  return {
    toast: (props) => {
      context.addToast(props)
    },
    dismiss: (id) => {
      context.removeToast(id)
    },
  }
}

function ToastContainer() {
  const { toasts, removeToast } = useContext(ToastContext)

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 max-h-screen w-full sm:max-w-sm overflow-hidden">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

function Toast({ id, title, description, type = "default", onClose }) {
  const typeStyles = {
    default: "bg-white border-gray-200",
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    warning: "bg-yellow-50 border-yellow-200",
    info: "bg-blue-50 border-blue-200",
  }

  const titleColors = {
    default: "text-gray-900",
    success: "text-green-800",
    error: "text-red-800",
    warning: "text-yellow-800",
    info: "text-blue-800",
  }

  const descriptionColors = {
    default: "text-gray-500",
    success: "text-green-700",
    error: "text-red-700",
    warning: "text-yellow-700",
    info: "text-blue-700",
  }

  return (
    <div
      className={cn(
        "relative flex w-full items-start gap-4 rounded-lg border p-4 shadow-sm animate-in slide-in-from-bottom-5",
        typeStyles[type],
      )}
    >
      <div className="flex-1">
        {title && <div className={cn("text-sm font-semibold", titleColors[type])}>{title}</div>}
        {description && <div className={cn("text-sm", descriptionColors[type])}>{description}</div>}
      </div>
      <button
        onClick={onClose}
        className="inline-flex h-6 w-6 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}