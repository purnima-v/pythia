'use client'
import { useState } from 'react'
import { useBets } from '@/components'

type BetFormData = {
  title: string
  amount: string
  description: string
}

export function CreateNewBet() {
  const [isOpen, setIsOpen] = useState(false)
  const { addBet, isLoading } = useBets()
  const [formData, setFormData] = useState<BetFormData>({
    title: '',
    amount: '',
    description: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addBet(formData)
    setFormData({ title: '', amount: '', description: '' })
    setIsOpen(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div >
      {/* Plus Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="center bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl hover:bg-blue-600"
      >
        +
      </button>

      {/* Popup Form */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-orange-700 p-6 rounded-lg w-96 border border-black border-2-px">
            <h2 className="text-xl mb-4">Create New Bet</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Bet Title"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Bet Amount"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-black px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}