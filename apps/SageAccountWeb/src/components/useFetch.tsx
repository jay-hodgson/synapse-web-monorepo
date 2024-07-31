const cache: { [key: string]: Promise<string> } = {}

const fetchData = (url: string): Promise<string> => {
  if (!cache[url]) {
    cache[url] = fetch(url).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.text() // Use response.json() if expecting JSON
    })
  }
  return cache[url]
}

const useFetch = (url: string): Promise<string> => {
  const data = fetchData(url)
  if (!data) {
    throw new Promise(resolve => setTimeout(resolve, 1000))
  }
  return data
}

export default useFetch
