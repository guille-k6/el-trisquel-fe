export default function Footer() {
    return (
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 gap-5">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-2">
              <svg width="24" height="24" viewBox="0 0 100 100" className="text-gray-600" fill="currentColor">
                <path d="M50 10 C30 10, 15 25, 15 45 C15 55, 20 64, 28 70 L35 65 C30 61, 27 53, 27 45 C27 32, 37 22, 50 22 C55 22, 60 24, 64 27 L69 20 C62 14, 56 10, 50 10 Z" />
                <path d="M85 45 C85 25, 70 10, 50 10 C40 10, 31 15, 25 22 L30 29 C34 24, 42 21, 50 21 C63 21, 73 31, 73 44 C73 49, 71 54, 68 58 L75 63 C81 56, 85 51, 85 45 Z" />
                <path d="M50 90 C70 90, 85 75, 85 55 C85 45, 80 36, 72 30 L65 35 C70 39, 73 47, 73 55 C73 68, 63 78, 50 78 C45 78, 40 76, 36 73 L31 80 C38 86, 44 90, 50 90 Z" />
              </svg>
              <span className="text-sm font-medium text-gray-600">El Trisquel</span>
            </div>
  
            {/* Copyright */}
            <div className="text-center sm:text-right">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} El Trisquel. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    )
  }