export function resolveComponents(components, instance) {

    components.keys().map(key => {

        let componentName = key.split('/').pop().split('.')[0];

        instance.component(componentName, components(key).default)

    })

}
