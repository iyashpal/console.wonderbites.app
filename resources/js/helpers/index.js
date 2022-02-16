export function resolveComponents(components, instance, prefix = 'V') {

    components.keys().map(key => {

        let componentName = key.split('/').pop().split('.')[0];

        instance.component(prefix + componentName, components(key).default)

    })

}
