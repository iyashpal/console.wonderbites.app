export function className(...classes) {
  return {className: classes.filter(Boolean).join(' ')}
}
