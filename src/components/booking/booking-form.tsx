'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'
import { BookingFormData, SeatSelection } from '../../types'

const bookingSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  emailOptIn: z.boolean(),
  smsOptIn: z.boolean(),
  accessibilityRequirements: z.string().optional(),
  specialRequests: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().optional()
})

interface BookingFormProps {
  selectedSeats: SeatSelection[]
  totalAmount: number
  onSubmit: (data: BookingFormData) => void
  isLoading?: boolean
  className?: string
}

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

const FormField: React.FC<FormFieldProps> = ({ label, error, required, children }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
)

export const BookingForm: React.FC<BookingFormProps> = ({
  selectedSeats,
  totalAmount,
  onSubmit,
  isLoading = false,
  className
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema as any),
    defaultValues: {
      emailOptIn: false,
      smsOptIn: false
    }
  })

  const phoneValue = watch('phone')
  const smsOptInDisabled = !phoneValue || phoneValue.trim() === ''

  const inputClasses = 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[var(--highlight)] focus:border-[var(--highlight)]'
  const textareaClasses = 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[var(--highlight)] focus:border-[var(--highlight)] resize-vertical min-h-[100px]'

  if (selectedSeats.length === 0) {
    return (
      <div className={cn('p-6 bg-gray-50 rounded-lg text-center', className)}>
        <p className="text-gray-700">Please select seats to continue with your booking.</p>
      </div>
    )
  }

  return (
    <div className={cn('max-w-2xl mx-auto', className)}>
      {/* Booking Summary */}
  <div className="mb-8 p-6 bg-emerald-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Récapitulatif de la réservation</h2>
        <div className="space-y-2 text-gray-800">
          {selectedSeats.map((selection) => (
            <div key={selection.seatId} className="flex justify-between items-center">
              <span>
                Siège {selection.seat.row}{selection.seat.number}
              </span>
              <span className="font-medium">${selection.price.toFixed(2)}</span>
            </div>
          ))}
      <div className="pt-2 border-t border-emerald-200">
            <div className="flex justify-between items-center font-semibold">
              <span>Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Information Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="First Name" error={errors.firstName?.message} required>
            <input
              {...register('firstName')}
              type="text"
              placeholder="Votre prénom"
              className={cn(inputClasses, errors.firstName && 'border-red-500')}
            />
          </FormField>

          <FormField label="Last Name" error={errors.lastName?.message} required>
            <input
              {...register('lastName')}
              type="text"
              placeholder="Votre nom de famille"
              className={cn(inputClasses, errors.lastName && 'border-red-500')}
            />
          </FormField>
        </div>

        <FormField label="Email Address" error={errors.email?.message} required>
          <input
            {...register('email')}
            type="email"
            placeholder="Votre adresse courriel"
            className={cn(inputClasses, errors.email && 'border-red-500')}
          />
        </FormField>


        <FormField label="Besoin en accessibilité" error={errors.accessibilityRequirements?.message}>
          <textarea
            {...register('accessibilityRequirements')}
            placeholder="Veuillez nous faire savoir si vous avez des besoins particuliers en matière d'accessibilité lors de votre visite."
            className={textareaClasses}
          />
        </FormField>

   

      
        {/* Terms and Conditions */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-gray-800">
            En complétant cette réservation, vous acceptez de vous conformer aux termes et conditions de l'événement. Nous vous remercions de votre collaboration
           
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Traitement en cours...' : `Compléter la réservation`}
        </Button>
      </form>
    </div>
  )
}
