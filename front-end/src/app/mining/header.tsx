import Link from 'next/link'

const Header = () => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-xl font-bold">
          <Link href="/">
            My Website
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-6 text-gray-700">
            <li>
              <Link href="/mining/1" className="hover:text-blue-600">Thống kê 1</Link>
            </li>
            <li>
              <Link href="/mining/2" className="hover:text-blue-600">Thống kê 2</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
