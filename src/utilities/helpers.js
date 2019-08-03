import pad from 'pad-left'
import { mergeWith, union, without, omit, identity, uniq } from 'lodash'

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export function retry(promiseCreator, { retries = 3, delay: retryDelay = 1000, multiplier = 2, before } = {}) {
  if (retries <= 0) {
    return promiseCreator()
  }
  return promiseCreator()
    .catch((e) => {
      if (typeof before === 'function') {
        before(retries, retryDelay, e)
      }
      return delay(retryDelay)
        .then(() => retry(promiseCreator, {
          retries: retries - 1,
          delay: retryDelay * multiplier,
          multiplier,
          before
        }))
    })
}

const getDate = (item, dateField) => {
  let d = typeof item === 'object' && item !== null && item[dateField]
  if (!d) { return 0 }
  if (!(d instanceof Date)) {
    d = new Date(d)
  }
  return d.getTime()
}

export const dateSort = (items, dir, dateField) => items
  .sort((a, b) => (dir === 'desc' ? -1 : 1) * (getDate(a, dateField) - getDate(b, dateField)))

export const numericalSort = (items, dir, field) => items
  .sort((a, b) => (dir === 'desc' ? -1 : 1) * (a[field]) > b[field])

export const splice = (arr, ...args) => {
  const spliced = [...arr]
  spliced.splice(...args)
  return spliced
}

export const uppercase = (str) => {
  if (typeof str !== 'string') return str
  return str.toUpperCase()
}

export const lowercase = (str) => {
  if (typeof str !== 'string') return str
  return str.toLowerCase()
}

export const shortener = (str, chars = 1, ellipsis = true) => {
  if (typeof str !== 'string') return str
  if (str.length <= chars) return str
  return str.slice(0, chars) + (ellipsis ? '...' : '')
}

export const timer = (seconds = 1, cb, done) => {
  let thisTimer
  thisTimer = window.setInterval(() => {
    seconds -= 1
    if (seconds <= 0) {
      window.clearInterval(thisTimer)
      done()
    } else {
      cb(seconds)
    }
  }, 1000)
  return thisTimer
}

export const processArray = (array, fn) => {
  const results = []
  return array.reduce((p, item) => p
    .then(() => fn(item))
    .then((data) => {
      results.push(data)
      return results
    }),
  Promise.resolve())
}

export const dateNowString = (splitSep = ' ', timeSep = ':') => {
  const d = new Date()
  const year = d.getUTCFullYear()
  const month = pad(d.getUTCMonth(), 2, '0')
  const date = pad(d.getUTCDate(), 2, '0')
  const hour = pad(d.getUTCHours(), 2, '0')
  const minutes = pad(d.getUTCMinutes(), 2, '0')
  const seconds = pad(d.getUTCSeconds(), 2, '0')
  return `${year}-${month}-${date}${splitSep}${hour}${timeSep}${minutes}${timeSep}${seconds}`
}

export const updateObjectInArray = (array, payload) => (
  array.map((item, index) => {
    if (index !== payload.index) return item

    return Object.assign({}, item, payload.item)
  })
)

export const sortByProperty = (arr, propOrTest, ...moreProps) => {
  let pass = []
  const fail = []
  arr.forEach((val) => {
    const condition = typeof propOrTest === 'function' ? propOrTest(val) : val[propOrTest]
    if (condition) {
      pass.push(val)
    } else {
      fail.push(val)
    }
  })
  if (moreProps.length > 0) {
    pass = sortByProperty(pass, ...moreProps)
  }
  return fail.concat(pass)
}

export const chunkify = (arr, size) => {
  let chunked = []
  if (size) {
    for (let i = 0, j = arr.length; i < j; i += size) {
      chunked.push(arr.slice(i, i + size))
    }
  }
  return chunked
}

export const filterObj = (filterList = [], obj = {}) => {
  const returnObj = {}
  if (!Array.isArray(filterList) || typeof obj !== 'object') return returnObj
  filterList.forEach((item) => {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(item)) returnObj[item] = obj[item]
  })
  return returnObj
}

export const promisifySync = (syncFn) => (...args) => new Promise((resolve, reject) => {
  try {
    resolve(syncFn(...args))
  } catch (err) {
    reject(err)
  }
})

export const parseJson = (jsonStr) => {
  try {
    return typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr
  } catch (_) {
    return null
  }
}

export const stringifyJson = (obj) => {
  try {
    return typeof obj !== 'string' ? JSON.stringify(obj) : obj
  } catch (_) {
    return ''
  }
}

export const makeEnum = (fields) => Object.freeze(fields.reduce((o, f) => ({ ...o, [f]: Symbol(f) })))

export const mapValues = (obj, valueMapper) => Object.entries(obj).reduce((result, [key, val]) => {
  result[key] = valueMapper(val, key)
  return result
}, {})


const mergeOps = {
  object: {
    $omit: (oldVal, newVal) => omit(oldVal, newVal)
  },
  array: {
    $set: (oldVal, newVal) => newVal,
    $union: (oldVal, newVal) => union(oldVal, newVal),
    $without: (oldVal, newVal) => without(oldVal, ...newVal),
    $append: (oldVal, newVal) => [...oldVal, ...newVal],
    $prepend: (oldVal, newVal) => [...newVal, ...oldVal],
  }
}

const isObj = (o) => typeof o === 'object' && o !== null

const getType = (x) => {
  if (x === null) {
    return 'null'
  } else if (Array.isArray(x)) {
    return 'array'
  } else {
    return typeof x
  }
}

const applyMergeOps = (oldVal, newVal) => {
  if (isObj(newVal)) {
    const ops = Object.keys(newVal)
    const [op] = ops
    const oldValType = getType(oldVal)
    const opFns = mergeOps[oldValType]
    if (ops.length === 1 && op.startsWith('$') && opFns) {
      const opFn = opFns[op]
      if (!opFn) {
        throw new Error(`Invalid ${oldValType} merge op ${op}`)
      }
      return opFn(oldVal, newVal[op])
    }
  } else if (Array.isArray(newVal)) {
    return newVal
  }
}

export const merge = (state, ...newStates) => newStates.reduce((result, newState) => {
  const updatedState = applyMergeOps(result, newState)
  if (updatedState) {
    return updatedState
  }
  return mergeWith({}, result, newState, applyMergeOps)
}, { ...state })

export const createMergeByField = (field) => (state, ...items) => merge(state, ...items.map((item) => ({ [item[field]]: item })))

export const mergeById = createMergeByField('id')

export const createUpserter = (indexField, defaultItemState, normalizeKey = identity) => (state, item) => {
  const id = normalizeKey(item[indexField])
  return {
    ...state,
    [id]: {
      ...(state[item[indexField]] || defaultItemState),
      ...item,
      [indexField]: id,
    }
  }
}

export const createUpdater = (indexField, normalizeKey = identity) => (state, item) => {
  const id = normalizeKey(item[indexField])
  const existingItem = state[id]
  return !existingItem ? state : {
    ...state,
    [id]: {
      ...existingItem,
      ...item,
      [indexField]: id,
    }
  }
}

export const reduceByKey = (objects, reduce, defaultValue) => {
  const result = {}
  objects.forEach((o) => {
    Object.entries(o).forEach(([k, v]) => {
      const current = result[k]
      result[k] = typeof current !== 'undefined' ? reduce(current, v) : reduce(defaultValue, v)
    })
  })
  return result
}

export const moveObjectToFrontOfArray = (array, key, match) => {
  return array = array.reduce((w, element) => {
    if (element[key] === match) {
      return [element, ...w];
    }
    return [...w, element];
  }, []);
}

export const isIterable = (o) => o != null && typeof o[Symbol.iterator] === 'function'

export const sortObjOfArrayByTwoProperties = (array, key1, key2, order = 'desc') => {
  return array.sort((a,b) => {
    let c1 = a[key1]
    let d1 = b[key1]
    let c2 = a[key2]
    let d2 = b[key2]
    if (order == 'asc') {
      if (c1 < d1) {
        return -1
      }
      if (c1 > d1) {
        return 1
      }
      if (c1 == d1) {
        if (c2 < d2) {
          return -1
        }
        if (c2 > d2) {
          return 1
        }
        return 0
      }
    } else {
      if (c1 > d1) {
        return -1
      }
      if (c1 < d1) {
        return 1
      }
    
      if (c1 == d1) {
        if (c2 > d2) {
          return -1
        }
        if (c2 < d2) {
          return 1
        }
        return 0
      }
    }
    
  })
}

export const getMonthFromDate = (date) => {
  // extract 
  if (!date) {
    return
  }
  date = date instanceof Date ? date : new Date(date)
  const monthInt = date.getMonth()
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months[monthInt]
}

export const getDayFromDate = (date) => {
  if (!date) {
    return
  }
  date = date instanceof Date ? date : new Date(date)
  return date.getDate()
}

export const shuffleArray = (array) => {
  let currentIndex = array.length, temporaryValue, randomIndex
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
  return array
}

export const removeDuplicatesFromString = (string, separator) => {
  return uniq(string.split(separator)).join(separator)
}

export const createXEMDeadline = () => {
  var NEM_EPOCH = Date.UTC(2015, 2, 28, 0, 6, 25, 0)
  return Math.floor((Date.now() / 1000) - (NEM_EPOCH / 1000))
}