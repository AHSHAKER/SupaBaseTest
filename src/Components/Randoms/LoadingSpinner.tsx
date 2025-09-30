
const LoadingSpinner = () => {
    return (
        <div className="min-h-40 h-full flex items-center justify-center">
            <div role="status" aria-live="polite" className="flex flex-col items-center gap-2">
                <svg className="h-8 w-8 text-blue-600 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <span className="text-slate-500">Loading . . .</span>
            </div>
        </div>
  )
}

export default LoadingSpinner