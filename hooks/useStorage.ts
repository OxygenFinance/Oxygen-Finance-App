"use client"

import { useState, useEffect } from "react"

interface StorageItem {
  id: string
  [key: string]: any
}

export function useLocalStorage<T extends StorageItem>(key: string, initialValue: T[] = []) {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T[]>(initialValue)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key)
      // Parse stored json or if none return initialValue
      const value = item ? JSON.parse(item) : initialValue
      setStoredValue(value)
    } catch (error) {
      // If error also return initialValue
      console.error("Error reading from localStorage:", error)
      setStoredValue(initialValue)
    } finally {
      setIsLoading(false)
    }
  }, [key, initialValue])

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value: T[] | ((val: T[]) => T[])) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      // Save state
      setStoredValue(valueToStore)
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error("Error writing to localStorage:", error)
    }
  }

  const addItem = (item: T) => {
    setValue((prevItems) => {
      // Check if item with same ID already exists
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id)
      if (existingItemIndex >= 0) {
        // Replace existing item
        const newItems = [...prevItems]
        newItems[existingItemIndex] = item
        return newItems
      } else {
        // Add new item
        return [...prevItems, item]
      }
    })
  }

  const updateItem = (id: string, updates: Partial<T>) => {
    setValue((prevItems) => {
      const itemIndex = prevItems.findIndex((item) => item.id === id)
      if (itemIndex === -1) return prevItems

      const newItems = [...prevItems]
      newItems[itemIndex] = { ...newItems[itemIndex], ...updates }
      return newItems
    })
  }

  const removeItem = (id: string) => {
    setValue((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const clearItems = () => {
    setValue([])
  }

  return {
    items: storedValue,
    setItems: setValue,
    addItem,
    updateItem,
    removeItem,
    clearItems,
    isLoading,
  }
}

interface Comment {
  id: string
  artwork_id: string
  user_id: string
  username: string
  profile_image?: string
  text: string
  timestamp: string
}

export function useComments(artworkId: string) {
  const storageKey = `comments_${artworkId}`
  const {
    items: comments,
    setItems: setComments,
    addItem: addCommentToStorage,
    updateItem: updateCommentInStorage,
    removeItem: removeCommentFromStorage,
    isLoading,
  } = useLocalStorage<Comment>(storageKey, [])

  const addComment = async (commentData: Omit<Comment, "id" | "timestamp">) => {
    const newComment: Comment = {
      ...commentData,
      id: `comment_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
    }

    addCommentToStorage(newComment)
    return newComment
  }

  const updateComment = async (id: string, text: string) => {
    updateCommentInStorage(id, { text })
  }

  const deleteComment = async (id: string) => {
    removeCommentFromStorage(id)
  }

  return {
    comments,
    addComment,
    updateComment,
    deleteComment,
    isLoading,
  }
}
