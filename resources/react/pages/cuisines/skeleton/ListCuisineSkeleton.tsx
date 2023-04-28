import {ListPageSkeleton} from "@/components/skeletons";

export default function ListCuisineSkeleton() {
  return <ListPageSkeleton columns={[
    {label: 'ID'},
    {label: 'Cuisine Name'},
    {label: 'Status', align: 'center'},
    {label: 'Created On', align: 'center'},
    {label: 'Added By'}
  ]} limit={10}/>
}
