import {useState} from "react";
import {useFlash} from "@/hooks";
import {Details} from "@/components/Show";
import TrashModal from "@/components/TrashModal";
import {Ingredient} from "@/types/models";
import Breadcrumb from "@/layouts/AuthLayout/Breadcrumb";
import {Link, useLoaderData, useNavigate} from "react-router-dom";

export default function ShowIngredient() {
  const flash = useFlash()
  const navigateTo = useNavigate()
  const {ingredient} = useLoaderData() as { ingredient: Ingredient }
  const [isTrashing, setIsTrashing] = useState<boolean>(false)

  function onEditHandler() {
    navigateTo(`/app/ingredients/${ingredient.id}/edit`)
  }

  function onTrashHandler() {
    setIsTrashing(true)
  }

  function onDeleteProduct() {
    setIsTrashing(false)
    flash.set('ingredient_deleted', true)
    navigateTo('/app/ingredients')
  }

  function onCloseTrash() {
    setIsTrashing(false)
  }

  function resolveCategoryName(ingredient: Ingredient, placeholder: string = '-') {
    let [category] = ingredient.categories ?? []

    return category?.id ? (
      <Link to={`/app/categories/${category.id}`} className={'text-red-primary'}>{category.name}</Link>
    ) : placeholder
  }

  function resolveCuisineName(ingredient: Ingredient, placeholder: string = '-') {
    let [category] = ingredient.categories ?? []
    let [cuisine] = category?.cuisines ?? []

    return cuisine?.id ? (
      <Link to={`/app/cuisines/${cuisine.id}`} className={'text-red-primary'}>{cuisine.name}</Link>
    ) : placeholder
  }

  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{name: 'Ingredient', href: '/app/ingredients'}, {name: 'Ingredient Details'}]}/>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <Details
            module="Ingredient"
            title={ingredient.name}
            by={ingredient?.user?.name ?? ''}
            date={ingredient.created_at}
            onClickEdit={onEditHandler}
            onClickTrash={onTrashHandler}
            fields={[
              {name: 'Name', value: ingredient.name},
              {name: 'ID', value: ingredient.id},
              {name: 'Cuisine', value: resolveCuisineName(ingredient)},
              {name: 'Price', value: `${ingredient.price}L`},
              {name: 'Category', value: resolveCategoryName(ingredient)},
              {name: 'Description', value: ingredient.description, textWrap: true},
              {name: 'Image', value: <img alt={ingredient.name} src={ingredient.thumbnailUrl} className="w-10 h-10 rounded-full"/>}
            ]}
          />

        </div>
      </div>
    </div>

    <TrashModal
      show={isTrashing}
      onClose={onCloseTrash}
      title={'Delete Ingredient'}
      onDelete={onDeleteProduct}
      url={`/ingredients/${ingredient.id}`}
      description={<>Are you sure you want to delete "<b>{ingredient.name}</b>"?</>}
    />
  </>
}
