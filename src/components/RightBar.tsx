import Link from "next/link"
import PopularTags from "./right/PopularTags"
import Recommendations from "./right/Recommendations"
import Search from "./right/Search"

export default function RightBar() {
  return (
    <div className="pt-4 flex flex-col gap-4 sticky top-0 h-max">
      <Search /> {/* Componente */}
      <PopularTags /> {/* Componente */}
      <Recommendations /> {/* Componente */}

      <div className="text-textGray text-sm flex gap-x-4 flex-wrap">
        <Link href="/">Terms of Service</Link>
        <Link href="/">Privacy Policy</Link>
        <Link href="/">Cookie Policy</Link>
        <Link href="/">Accessibility</Link>
        <Link href="/">Ads Info</Link>
        <span>© 2025 L Corp.</span>
      </div>
    </div>
  )
}