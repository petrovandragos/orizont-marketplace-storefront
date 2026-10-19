const TopBar = () => {
  return (
    <div className="hidden md:block bg-[#F5F5F7] text-[#6E6E73] text-xs">
      <div className="content-container flex items-center justify-between h-8">
        <div className="flex items-center gap-x-5">
          {/* Phone */}
          <a
            href="tel:0730076606"
            className="flex items-center gap-x-1.5 hover:text-[#1D1D1F] transition-colors"
          >
            <svg
              className="w-3.5 h-3.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>0730 076 606</span>
          </a>

          {/* Email */}
          <a
            href="mailto:comenzi@orizont-srl.ro"
            className="flex items-center gap-x-1.5 hover:text-[#1D1D1F] transition-colors"
          >
            <svg
              className="w-3.5 h-3.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>comenzi@orizont-srl.ro</span>
          </a>
        </div>

        {/* Working hours */}
        <div className="flex items-center gap-x-1.5">
          <svg
            className="w-3.5 h-3.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Luni–Vineri 08:00–17:00, sâmbătă 08:00–13:00</span>
        </div>
      </div>
    </div>
  )
}

export default TopBar
