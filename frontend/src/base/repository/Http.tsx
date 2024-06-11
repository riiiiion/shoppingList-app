export interface Http {
  get<T>(url: string): Promise<T>
  post<T,U>(url: string, body: U): Promise<T>
  patch<T,U>(url: string, body: U): Promise<T>
  delete<T,U>(url: string, body: U): Promise<T>
}

export class NetworkHttp implements Http {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url)
    return response.json()
  }

  async post<T,U>(url: string, body: U): Promise<T> {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const text = await res.text()
    return text ? JSON.parse(text) : {}
  }
  async patch<T,U>(url: string, body: U): Promise<T> {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(body),
    }
    )
    const text = await res.text()
    return text ? JSON.parse(text) : {}
  }

  async delete<T,U>(url: string,body:U): Promise<T> {
      const res  = await fetch(url, {
        method:'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(body),
      })
      const text = await res.text()
      return text ? JSON.parse(text) : {}

  }
}
