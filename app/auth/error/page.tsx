import ErrorState from '@/components/ErrorState'

export default function AuthError() {
  return (
    <ErrorState message="Something went sideways while signing you in. Give it another try." />
  )
}
