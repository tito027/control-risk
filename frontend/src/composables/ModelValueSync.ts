import { computed } from "vue"

export default function <
  T,
  R extends keyof T,
  E extends { (e: any, payload: T[R]): void }
>(props: T, prop: R, emits: E) {
  const value = computed({
    get: () => props[prop],
    set: value => emits(`update:${prop.toString()}`, value),
  })
  return { value }
}
