"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, ImageIcon, type File, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploadProps {
  onFileSelected: (file: File) => void
  accept?: string
  maxSizeMB?: number
}

export default function FileUpload({ onFileSelected, accept = "image/*", maxSizeMB = 5 }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setFileError(`File size exceeds ${maxSizeMB}MB limit`)
      return false
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setFileError("Only image files are accepted")
      return false
    }

    setFileError(null)
    return true
  }

  const processFile = (file: File) => {
    if (validateFile(file)) {
      // Create preview
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Pass file to parent
      onFileSelected(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  const clearPreview = () => {
    setPreview(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <img src={preview || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={clearPreview}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors ${
            dragActive ? "border-darkGreen-500 bg-darkGreen-50/50" : "border-muted-foreground/25"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input ref={inputRef} type="file" className="hidden" accept={accept} onChange={handleChange} />

          <Upload className="h-12 w-12 text-muted-foreground mb-4" />

          <p className="text-sm text-muted-foreground mb-4 text-center">
            Drag and drop an image here, or click the button below
          </p>

          <Button onClick={handleButtonClick}>
            <ImageIcon className="h-4 w-4 mr-2" />
            Select Image
          </Button>

          {fileError && <p className="mt-4 text-sm text-destructive">{fileError}</p>}

          <p className="mt-4 text-xs text-muted-foreground">
            Supported formats: JPG, PNG, GIF • Max size: {maxSizeMB}MB
          </p>
        </div>
      )}
    </div>
  )
}
