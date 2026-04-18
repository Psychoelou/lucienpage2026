'use client'

import React, { useState, useMemo } from 'react'
import { cn } from '../../lib/utils'
import { Seat, SeatSelection, TicketType, SeatingLayout } from '../../types'

interface SeatGridProps {
  seatingLayout: SeatingLayout
  selectedSeats: SeatSelection[]
  onSeatSelect: (seat: Seat, ticketType: TicketType) => void
  onSeatDeselect: (seatId: string) => void
  onTicketTypeChange: (seatId: string, ticketType: TicketType) => void
  bookedSeats: string[] // Array of seat IDs that are already booked
  prices: {
    adult: number
    child: number
    concession: number
  }
  className?: string
}

interface SeatComponentProps {
  seat: Seat
  isSelected: boolean
  isBlocked?: boolean
  isBooked: boolean
  onSelect: () => void
  onDeselect: () => void
  selectedTicketType?: TicketType
}

const SeatComponent: React.FC<SeatComponentProps> = ({
  seat,
  isSelected,
  isBooked,
  isBlocked,
  onSelect,
  onDeselect,
  selectedTicketType
}) => {
  const getSeatClasses = () => {
    const baseClasses = 'w-8 h-8 rounded-t-lg border-2 cursor-pointer transition-colors flex items-center justify-center text-xs font-medium'

    if (isBlocked) {
  return cn(baseClasses, 'bg-purple-300 border-purple-600 text-purple-900 cursor-not-allowed')
}

if (isBooked) {
  return cn(baseClasses, 'bg-red-200 border-red-500 text-red-800 cursor-not-allowed')
}

    if (isSelected) {
      const ticketColors = {
        [TicketType.ADULT]: 'bg-blue-500 border-blue-600 text-white',
        [TicketType.CHILD]: 'bg-green-500 border-green-600 text-white',
        [TicketType.CONCESSION]: 'bg-purple-500 border-purple-600 text-white'
      }
      return cn(baseClasses, ticketColors[selectedTicketType || TicketType.ADULT])
    }

    if (seat.isAccessible) {
      return cn(baseClasses, 'bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200')
    }

    return cn(baseClasses, 'bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200')
  }

  const handleClick = () => {
    if (isBooked || isBlocked) return

    if (isSelected) {
      onDeselect()
    } else {
      onSelect()
    }
  }

  return (
    <div
      onClick={handleClick}
      className={getSeatClasses()}
      title={
  isBlocked
    ? `${seat.row}${seat.number} (Réservé école)`
    : `${seat.row}${seat.number}${seat.isAccessible ? ' (Accessible)' : ''}${isBooked ? ' (Booked)' : ''}`
}
    >
      {seat.number}
    </div>
  )
}

interface TicketTypeSelectorProps {
  selectedSeats: SeatSelection[]
  onTicketTypeChange: (seatId: string, ticketType: TicketType) => void
  onSeatDeselect: (seatId: string) => void
  prices: {
    adult: number
    child: number
    concession: number
  }
}

const TicketTypeSelector: React.FC<TicketTypeSelectorProps> = ({
  selectedSeats,
  onTicketTypeChange,
  onSeatDeselect,
  prices
}) => {
  if (selectedSeats.length === 0) return null

  return (
    <div className="mt-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Selected Seats</h3>
        <span className="text-sm text-gray-600 bg-blue-50 px-2 py-1 rounded">
          {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {selectedSeats.map((selection) => (
          <div key={selection.seatId} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
            {/* Left side: Seat info and ticket selector */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              {/* Seat indicator */}
              <div className="flex items-center gap-3 sm:min-w-[120px]">
                <div className="w-8 h-8 bg-blue-100 border-2 border-blue-300 rounded-t flex items-center justify-center text-xs font-medium text-blue-800">
                  {selection.seat.number}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Row {selection.seat.row}, Seat {selection.seat.number}
                  </div>
                  {selection.seat.isAccessible && (
                    <div className="text-xs text-blue-600 font-medium">Accessible</div>
                  )}
                </div>
              </div>

              {/* Ticket type selector */}
              <div className="flex items-center gap-2 sm:w-48">
                <label htmlFor={`ticket-type-${selection.seatId}`} className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Ticket Type:
                </label>
                <select
                  id={`ticket-type-${selection.seatId}`}
                  value={selection.ticketType}
                  onChange={(e) => onTicketTypeChange(selection.seatId, e.target.value as TicketType)}
                  className="flex-1 sm:flex-none sm:w-32 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  aria-label={`Ticket type for seat ${selection.seat.row}${selection.seat.number}`}
                >
                  <option className="text-gray-800" value={TicketType.ADULT}>Adult (£{prices.adult.toFixed(2)})</option>
                  <option className="text-gray-800" value={TicketType.CHILD}>Child (£{prices.child.toFixed(2)})</option>
                  <option className="text-gray-800" value={TicketType.CONCESSION}>Concession (£{prices.concession.toFixed(2)})</option>
                </select>
              </div>
            </div>

            {/* Right side: Price and remove button */}
            <div className="flex items-center justify-between sm:justify-end gap-4">
              {/* Price display */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Price:</span>
                <span className="text-lg font-semibold text-gray-900">
                  £{selection.price.toFixed(2)}
                </span>
              </div>

              {/* Remove button */}
              <button
                onClick={() => onSeatDeselect(selection.seatId)}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none"
                title={`Remove seat ${selection.seat.row}${selection.seat.number}`}
                aria-label={`Remove seat ${selection.seat.row}${selection.seat.number} from selection`}
                type="button"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="hidden sm:inline">Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total section */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
          <div>
            <div className="text-sm font-medium text-gray-700">Total Amount</div>
            <div className="text-xs text-gray-600">
              {selectedSeats.length} ticket{selectedSeats.length !== 1 ? 's' : ''}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-900">
              £{selectedSeats.reduce((sum, seat) => sum + seat.price, 0).toFixed(2)}
            </div>
            <div className="text-xs text-blue-700">
              inc. all fees
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const SeatGrid: React.FC<SeatGridProps> = ({
  seatingLayout,
  selectedSeats,
  onSeatSelect,
  onSeatDeselect,
  onTicketTypeChange,
  bookedSeats,
  prices,
  className
}) => {
  const [defaultTicketType, setDefaultTicketType] = useState<TicketType>(TicketType.ADULT)
  const layout: Record<string, any> = {
  A: {
    left: [18,16,14,12],
    center: [10,8,6,4,2,1,3,5,7,9,11],
    right: [13,15,17,19]
  },
  B: {
    left: [20,18,16,14,12],
    center: [10,8,6,4,2,1,3,5,7,9],
    right: [13,15,17,19]
  },
  C: {
    left: [22,20,18,16,14,12],
    center: [10,8,6,4,2,1,3,5,7,9,11],
    right: [13,15,17,19,21,23]
  },
  D: {
    left: [24,22,20,18,16,14,12],
    center: [10,8,6,4,2,1,3,5,7,9],
    right: [13,15,17,19,21,23]
  },
  E: {
    left: [26,24,22,20,18,16,14,12],
    center: [10,8,6,4,2,1,3,5,7,9,11],
    right: [13,15,17,19,21,23,25,27]
  },
  F: {
  left: [26,24,22,20,18,16,14,12],
  center: [10,8,6,4,2,1,3,5,7,9],
  right: [11,13,15,17,19,21,23,25]
},
G: {
  left: [26,24,22,20,18,16,14,12],
  center: [10,8,6,4,2,1,3,5,7,9,11],
  right: [13,15,17,19,21,23,25,27]
},
H: {
  left: [26,24,22,20,18,16,14,12],
  center: [10,8,6,4,2,1,3,5,7,9],
  right: [11,13,15,17,19,21,23,25]
},

// ⚠️ PAS DE I

J: {
  left: [26,24,22,20,18,16,14,12],
  center: [10,8,6,4,2,1,3,5,7,9,11],
  right: [13,15,17,19,21,23,25,27]
},
K: {
  left: [26,24,22,20,18,16,14,12],
  center: [10,8,6,4,2,1,3,5,7,9],
  right: [11,13,15,17,19,21,23,25]
},
L: {
  left: [26,24,22,20,18,16,14,12],
  center: [10,8,6,4,2,1,3,5,7,9,11],
  right: [13,15,17,19,21,23,25,27]
},
M: {
  left: [26,24,22,20,18,16,14,12],
  center: [10,8,6,4,2,1,3,5,7,9],
  right: [11,13,15,17,19,21,23,25]
},
N: {
  left: [26,24,22,20,18,16,14,12],
  center: [10,8,6,4,2,1,3,5,7,9,11],
  right: [13,15,17,19,21,23,25,27]
},
O: {
  left: [26,24,22,20,18,16,14,12],
  center: [10,8,6,4,2,1,3,5,7,9],
  right: [11,13,15,17,19,21,23,25]
},
P: {
  left: [26,24,22,20,18,16,14,12],
  center: [10,8,6,4,2,1,3,5,7,9,11],
  right: [13,15,17,19,21,23,25,27]
},
Q: {
  left: [26,24,22,20,18,16,14,12],
  center: [10,8,6,4,2,1,3,5,7,9],
  right: [11,13,15,17,19,21,23,25]
},
R: {
  left: [26,24,22,20,18,16,14,12],
  center: [10,8,6,4,2,1,3,5,7,9,11],
  right: [13,15,17,19,21,23,25,27]
},
S: {
  left: [26,24,22,20,18,16,14,12],
  center: [10,8,6,4,2,1,3,5,7,9],
  right: [11,13,15,17,19,21,23,25]
}
}
const blockedSeats: string[] = []

const rowsLeftRight = [
  'A','B','C','D','E','F','G','H',
  'J','K','L','M','N','O'
]

const rowsCenter = ['A','B','C','D','E']

// 🔴 Gauche A → O
rowsLeftRight.forEach(row => {
  layout[row]?.left.forEach((num: number) => {
    blockedSeats.push(`G_${row}_${num}`)
  })
})

// 🔴 Droite A → O
rowsLeftRight.forEach(row => {
  layout[row]?.right.forEach((num: number) => {
    blockedSeats.push(`D_${row}_${num}`)
  })
})

// 🔴 Centre A → E
rowsCenter.forEach(row => {
  layout[row]?.center.forEach((num: number) => {
    blockedSeats.push(`C_${row}_${num}`)
  })
})
  // Group seats by row for rendering
  const seatsByRow = useMemo(() => {
    const grouped: { [row: string]: Seat[] } = {}
    seatingLayout.seats.forEach(seat => {
      if (!grouped[seat.row]) {
        grouped[seat.row] = []
      }
      grouped[seat.row].push(seat)
    })

    // Sort seats within each row by number
    Object.keys(grouped).forEach(row => {
      grouped[row].sort((a, b) => Number(a.number) - Number(b.number))
    })

    return grouped
  }, [seatingLayout.seats])

  const sortedRows = [
  'A','B','C','D','E','F','G','H',
  'J','K','L','M','N','O','P','Q','R','S'
]

  const handleSeatSelect = (seat: Seat) => {
    onSeatSelect(seat, defaultTicketType)
  }



  return (
    <div className={cn('w-full', className)}>
      {/* Default ticket type selector */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
       
        
      </div>

      {/* Stage indicator */}
      <div className="text-center mb-8">
        <div className="inline-block px-8 py-2 bg-gray-800 text-white rounded-t-lg">
          STAGE
        </div>
      </div>

      {/* Seat grid */}
      <div className="flex flex-col items-center gap-2 mb-6">
      {sortedRows.map((row) => {
  const rowLayout = layout[row]
if (!rowLayout) return null

const left = rowLayout.left.map((num: number) => ({
  id: `G_${row}_${num}`,
  number: num,
  row
}))

const center = rowLayout.center.map((num: number) => ({
  id: `C_${row}_${num}`,
  number: num,
  row
}))

const right = rowLayout.right.map((num: number) => ({
  id: `D_${row}_${num}`,
  number: num,
  row
}))
  
  const sortSeats = (arr: Seat[]) =>
  [...arr].sort((a, b) => Number(a.number) - Number(b.number))
    
  
  const leftSorted = sortSeats(left)
  const centerSorted = sortSeats(center)
  const rightSorted = sortSeats(right)
  
  
console.log("SEAT GRID RENDERED")
  return (
  <div key={row} className="w-full flex justify-center">
    <div className="flex items-center justify-center gap-6 w-full max-w-5xl">

      {/* Row label */}
      <div className="w-8 text-center font-medium text-gray-800 mr-2">
        {row}
      </div>

      {/* Gauche */}
      <div className="flex gap-1 justify-center w-[220px]">
       {leftSorted.map((seat) => {
  const selection = selectedSeats.find(s => s.seatId === seat.id)
  const isBlocked = blockedSeats.includes(seat.id)

  return (
    <SeatComponent
      key={seat.id}
      seat={seat}
      isSelected={!!selection}
      isBooked={bookedSeats.includes(seat.id) || isBlocked}
      isBlocked={isBlocked}
      onSelect={() => handleSeatSelect(seat)}
      onDeselect={() => onSeatDeselect(seat.id)}
      selectedTicketType={selection?.ticketType}
    />
  )
})}
      </div>

      {/* Allée */}
      <div className="w-8" />

      {/* Centre */}
      <div className="flex gap-1 justify-center w-[320px]">
        {centerSorted.map((seat) => {
           const selection = selectedSeats.find(s => s.seatId === seat.id)
           const isBlocked = blockedSeats.includes(seat.id)
            return (
    <SeatComponent
      key={seat.id}
      seat={seat}
      isSelected={!!selection}
      isBooked={bookedSeats.includes(seat.id) || isBlocked}
      isBlocked={isBlocked}
      onSelect={() => handleSeatSelect(seat)}
      onDeselect={() => onSeatDeselect(seat.id)}
      selectedTicketType={selection?.ticketType}
    />
  )
})}
      </div>

      {/* Allée */}
      <div className="w-8" />

      {/* Droite */}
      <div className="flex gap-1 justify-center w-[220px]">
        {rightSorted.map((seat) => {
            const selection = selectedSeats.find(s => s.seatId === seat.id)
            const isBlocked = blockedSeats.includes(seat.id)

          return (
    <SeatComponent
      key={seat.id}
      seat={seat}
      isSelected={!!selection}
      isBooked={bookedSeats.includes(seat.id) || isBlocked}
      isBlocked={isBlocked}
      onSelect={() => handleSeatSelect(seat)}
      onDeselect={() => onSeatDeselect(seat.id)}
      selectedTicketType={selection?.ticketType}
    />
  )
})}
      </div>

    </div>
  </div>
)
})}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">

  <div className="flex items-center gap-2">
    <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded-t"></div>
    <p className="text-gray-800">Disponible</p>
  </div>

  <div className="flex items-center gap-2">
    <div className="w-4 h-4 bg-red-200 border-2 border-red-500 rounded-t"></div>
    <p className="text-gray-800">Réservé</p>
  </div>

  <div className="flex items-center gap-2">
    <div className="w-4 h-4 bg-purple-300 border-2 border-purple-600 rounded-t"></div>
    <p className="text-gray-800">Réservé école</p>
  </div>

</div>

      {/* Selected seats summary */}
     
    </div>
  )
}
