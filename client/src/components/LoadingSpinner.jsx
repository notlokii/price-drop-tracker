function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-2 border-neon/20" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-neon border-r-neon-bright" />
      </div>
      <p className="mt-4 text-sm uppercase tracking-widest text-muted">{label}</p>
    </div>
  )
}

export default LoadingSpinner
