import {Link, useMatches} from 'react-router-dom'
import {HomeIcon} from '@heroicons/react/20/solid'
import {ForwardSlashIcon} from '~/components/icons'

export default function Breadcrumb({pages}: { pages: { name: string, href?: string }[] }) {
  let matches = useMatches()

  function isMatchWithCurrent(uri) {
    return matches.some(({pathname}) => pathname === uri)
  }

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-1">
        <li>
          <div>
            <Link to="/app/dashboard" className={`${isMatchWithCurrent('/app/dashboard') ? 'text-slate-900 hover:text-slate-400' : 'text-slate-400 hover:text-slate-900'}`}>
              <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true"/>
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {pages.map((page) => (
          <li key={page.name}>
            <div className="flex items-center">
              <ForwardSlashIcon className="h-5 w-5 flex-shrink-0 text-slate-900"/>
              {page.href ? <>
                <Link to={page.href} className={[isMatchWithCurrent(page.href) ? 'text-slate-900 hover:text-slate-400' : 'text-slate-400 hover:text-slate-900', 'ml-1 text-sm font-medium'].join(' ')} aria-current={isMatchWithCurrent(page.href) ? 'page' : undefined}>
                  {page.name}
                </Link>
              </> : <>
                <span className="ml-1 text-sm font-medium text-slate-900 hover:text-slate-700" aria-current={'page'}>
                  {page.name}
                </span>
              </>}

            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
