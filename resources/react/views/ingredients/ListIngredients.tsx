import IndexTable from "@/components/IndexTable";
import IndexFilters from "@/components/IndexFilters";
import Breadcrumb from "~/layouts/AuthLayout/Breadcrumb";
import {BookmarkIcon, HashtagIcon} from "@heroicons/react/24/outline";

export default function ListIngredients() {
  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{name: 'Ingredients'}]}/>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5">
        <IndexFilters sortBy={[
          {label: 'ID', value: 'id', icon: <HashtagIcon className={'w-5 h-5'}/>},
          {label: 'Name', value: 'name', icon: <BookmarkIcon className={'w-5 h-5'} />}
        ]} create={{url: '/app/ingredients/create', label: 'Add Ingredient'}}/>

        <IndexTable />
      </div>
    </div>
  </>
}
