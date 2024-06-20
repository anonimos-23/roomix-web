import axios from 'axios'

export interface CountryProps {
  key: string
  name: string
}

export interface GetCountriesResponse {
  countries: CountryProps[]
}

export async function getCountries(): Promise<GetCountriesResponse> {
  const response = await axios.get('https://restcountries.com/v3.1/all')

  if (response.status === 200) {
    return {
      countries: response.data.map((country: any) => {
        return {
          key: country.cca3,
          name: country.name.common,
        }
      }),
    }
  }

  throw new Error('Algo inesperado aconteceu!')
}
