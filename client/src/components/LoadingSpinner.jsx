function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-indigo-500" />
      <p className="mt-3 text-sm text-gray-400">{label}</p>
    </div>
  )
}

export default LoadingSpinner
