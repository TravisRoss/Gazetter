// __tests__/countrySelect.test.js
import { selectCountry, fetchPOIData, showWeatherModal } from '../src/app.js'
require('jquery')
import L from 'leaflet'

// Mock jQuery and Leaflet
jest.mock('jquery', () => ({
  modal: jest.fn(),
  prop: jest.fn(),
  find: jest.fn(),
  val: jest.fn(),
  on: jest.fn(),
}))
jest.mock('leaflet')

// Mock global objects
global.window = {
  map: { addControl: jest.fn() },
  mapBounds: null,
  countryCode: null,
  nearbyPizzaClusterGroup: { clearLayers: jest.fn() },
  nearbyShopsClusterGroup: { clearLayers: jest.fn() },
  evStationsClusterGroup: { clearLayers: jest.fn() },
  nearbyPoisFeatureGroup: { clearLayers: jest.fn() },
}

// Mock dependencies
const mockBorderResponse = {
  data: {
    geometry: {
      coordinates: [
        [
          [6.73, 51.22], // Düsseldorf coordinates
          [6.8, 51.25],
          [6.75, 51.2],
        ],
      ],
    },
  },
}

const mockCoreInfoResponse = {
  status: { name: 'ok' },
  data: {
    capital: 'Berlin',
    population: 8300000,
  },
}

const mockWeatherData = {
  forecast: {
    forecastday: [
      {
        date: '2023-10-01',
        day: {
          condition: { text: 'Sunny' },
          avgtemp_c: 20,
          maxwind_kph: 15,
          avghumidity: 50,
        },
      },
    ],
  },
}

// Mock implementations
beforeEach(() => {
  global.fetch = jest.fn()
  $.modal.mockClear()
  L.easyButton.mockImplementation(() => ({
    button: { style: {} },
    addTo: jest.fn(),
  }))
})

describe('selectCountry', () => {
  beforeEach(() => {
    fetch.mockImplementation((url) => {
      if (url.includes('getCountryBorder')) {
        return Promise.resolve({ json: () => mockBorderResponse })
      }
      if (url.includes('getCoreInfo')) {
        return Promise.resolve({ json: () => mockCoreInfoResponse })
      }
      return Promise.reject(new Error('Invalid URL'))
    })
  })

  test('should set correct map bounds and country code', async () => {
    await selectCountry()

    expect(window.mapBounds).toEqual({
      north: 51.25,
      south: 51.2,
      east: 6.8,
      west: 6.73,
    })
    expect(window.countryCode).toBe($('#selCountry').val())
  })

  test('should fetch weather data but not show modal', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({ json: () => mockWeatherData })
    )

    await selectCountry()

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('api.weatherapi.com')
    )
    expect($.modal).not.toHaveBeenCalled()
  })

  test('should handle POI fetching with valid parameters', async () => {
    await selectCountry()

    expect(fetchPOIData).toHaveBeenCalledWith(expect.any(String), {
      north: 51.25,
      south: 51.2,
      east: 6.8,
      west: 6.73,
      countrySet: window.countryCode,
    })
  })
})

describe('Weather Modal Interactions', () => {
  test('should open modal with weather data when button clicked', () => {
    const button = L.easyButton.mock.results[0].value
    button.options.onClick()

    expect(showWeatherModal).toHaveBeenCalledWith(mockWeatherData)
    expect($.modal).toHaveBeenCalledWith('show')
  })

  test('should handle missing weather data gracefully', () => {
    showWeatherModal(null)
    expect($.modal).not.toHaveBeenCalled()
  })
})

describe('POI Handling', () => {
  test('should clear previous markers on new selection', async () => {
    await selectCountry()
    await selectCountry()

    expect(window.nearbyPizzaClusterGroup.clearLayers).toHaveBeenCalledTimes(2)
  })

  test('should handle invalid border response', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ json: () => ({}) }))

    await expect(selectCountry()).rejects.toThrow('No coordinates found')
  })
})

describe('Error Handling', () => {
  test('should handle missing capital', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => ({
          ...mockCoreInfoResponse,
          data: { capital: null },
        }),
      })
    )

    await selectCountry()
    expect(fetchWeatherDataForCapital).not.toHaveBeenCalled()
  })
})
