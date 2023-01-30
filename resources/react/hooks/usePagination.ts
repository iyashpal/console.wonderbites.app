import { useEffect, useState } from 'react';
import { PaginationMeta } from '~/types';

type ComponentProps = {

    meta: PaginationMeta,

    url?: string,

}

type Slider = { first: number[], active: number[], last: number[] }

export default function usePagination({ meta, url }: ComponentProps) {

    const [pages, setPages] = useState<number[]>([] as number[])
    const [slider, setSlider] = useState<Slider>({ first: [], active: [], last: [] })

    useEffect(() => {


        resolvePages().map(page => {

            if (page <= (meta.first_page + 1)) {

                resolveFirstSlider(page)

            }

            if (page >= (meta.last_page - 1)) {

                resolveLastSlider(page)

            }

            if (page >= (meta.current_page - 1) && page <= (meta.current_page + 1)) {

                resolveActiveSlider(page)

            }

        })

        console.log(slider)

    }, [meta])

    function resolvePages(): number[] {
        for (let i = 1; i <= meta.last_page; i++) {
            setPages(stack => ((!stack.includes(i) ? stack.push(i) : null), stack))
        }

        return pages
    }


    function resolveFirstSlider(page: number) {

        setSlider(slide => {

            if (!slide.first.includes(page)) {
                slide.first.push(page)
            }

            return slide
        })

    }

    function resolveActiveSlider(page: number) {
        setSlider(slide => {

            if ((!slide.first.includes(page) && !slide.active.includes(page) && !slide.last.includes(page))) {
                slide.active.push(page)
            }

            return slide
        })
    }


    function resolveLastSlider(page: number) {
        setSlider(slide => {

            if (!slide.last.includes(page)) {

                slide.last.push(page)

            }

            return slide
        })
    }


    function isFirstSeparatorEnabled() {

        return (slider.active[0] - slider.first[1]) > 1
    }

    function isLastSeparatorEnabled() {
        return (slider.last[0] - slider.active[slider.active.length - 1]) > 1
    }

    function items() {
        let links = [...slider.first];

        if (isFirstSeparatorEnabled()) {
            links.push(0)
        }

        links.push(...slider.active)

        if (isLastSeparatorEnabled()) {
            links.push(0)
        }

        links.push(...slider.last)

        return links
    }

    return {

        isFirstSeparatorEnabled,

        isLastSeparatorEnabled,

        items: items,

        page: {
            firstItem() {
                return (meta.per_page * meta.current_page) - (meta.per_page - 1)
            },
            lastItem() {
                return meta.per_page * meta.current_page
            },
        },

        total() {
            return meta.total
        },

        pages,

        current: {
            firstItem() {
                return (meta.per_page * meta.current_page) - (meta.per_page - 1)
            },

            lastItem() {
                return meta.per_page * meta.current_page
            },
        }
    }

}
