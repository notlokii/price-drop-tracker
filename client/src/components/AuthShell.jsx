function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="cyber-page flex min-h-screen items-center justify-center px-4">
      <div className="cyber-corner-card cyber-panel w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <p className="cyber-logo mb-4">
            Price<span className="cyber-logo-accent">Drop</span>
          </p>
          <h1 className="cyber-heading mb-2 text-2xl">{title}</h1>
          <p className="text-sm text-muted">{subtitle}</p>
        </div>

        {children}

        {footer && (
          <p className="mt-6 text-center text-sm text-muted">{footer}</p>
        )}
      </div>
    </div>
  )
}

export default AuthShell
