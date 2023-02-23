import {Link} from 'react-router-dom';
import {HomeIcon} from '@heroicons/react/20/solid';
import {ForwardSlashIcon} from '~/components/icons';

export default function BreadcrumbSkeleton({pages}: { pages?: number[] }) {
  return <>
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-1">

        <li>
          <div>
            <Link to="/app/dashboard" className={`text-slate-400 hover:text-slate-900`}>
              <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true"/>
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>

        {(pages ?? []).map((page, index) => (
          <li key={index}>
            <div className="flex items-center">
              <ForwardSlashIcon className="h-5 w-5 flex-shrink-0 text-slate-900"/>
              <span className="inline-block ml-1 w-14 py-2 bg-gray-200 rounded-md animate-pulse"></span>
            </div>
          </li>
        ))}

      </ol>
    </nav>
  </>
}
