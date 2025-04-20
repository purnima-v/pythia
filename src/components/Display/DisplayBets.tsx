'use client'
import { useBets } from '../betContext'

export function DisplayBets() {
  const { bets } = useBets()

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Bets</h2>
      <div className="grid gap-4">
        {bets.map((bet) => (
          <div key={bet.id} className="bg-orange-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-orange-800">{bet.title}</h3>
            <p className="text-green-600 text-lg font-semibold mt-2">Amount: ${bet.amount}</p>
            <p className="mt-2 text-gray-700">{bet.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(bet.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      {bets.length === 0 && (
        <p className="text-center text-gray-500">No bets created yet</p>
      )}
    </div>
  )
}