import memoize from 'memoizee'

import {
  createEntityStore,
  createEntityQuery,
} from '@datorama/akita'

const initialState = {}

export const storeName = 'stats'

export const createStore = memoize((version, initial) => {
  const store = createEntityStore({
    ...initialState,
    version,
  }, {
    name: storeName,
  })
  if (initial) {
    store.set(initial)
  }

  const query = createEntityQuery(store)

  return {
    data: store,
    query,
  }
})
