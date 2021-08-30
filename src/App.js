import React, { useEffect, useState } from 'react'
import './App.css'
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from '@material-ui/core'
import InfoBox from './components/InfoBox'
import Map from './components/Map'
import Table from './components/Table'
import LineGraph from './components/LineGraph'
import { sortData } from './utils'
import 'leaflet/dist/leaflet.css'
import { prettyPrintStat } from './utils'
import $ from 'jquery'

const App = () => {
  // STATE VAIRABLES
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [casesType, setCasesType] = useState('cases')
  const [mapCountries, setMapCountries] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    $(function () {
      $('.loader').delay(2000).fadeOut('slow')
      $('#overlayer').delay(2000).fadeOut('slow')
      setLoading(false)
    })
  }, [])

  // MAP CENTER
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 })
  // ZOOM LEVEL
  const [mapZoom, setMapZoom] = useState(3)

  // FETCH WORLDWIDE DATA WHEN THE COMPONENT FIRST LOADS
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data)
      })
  }, [])

  // FETCH DATA
  useEffect(() => {
    const fetchCountryData = async () => {
      const response = await fetch('https://disease.sh/v3/covid-19/countries')
      const finalResponse = await response.json()

      const newCountries = finalResponse.map((item) => ({
        // GETTING COUNTRIES NAME
        name: item.country,
        value: item.countryInfo.iso2,
      }))

      // SORTING COUNTRIES BY HIGHEST CASES
      const sortedData = sortData(finalResponse)
      setTableData(sortedData)
      setCountries(newCountries)
      setMapCountries(finalResponse)
    }
    fetchCountryData()
  }, [])

  // SELECT ONCHANGE
  const handleChange = async (event) => {
    const selectedCountry = event.target.value
    setCountry(selectedCountry)

    const url =
      selectedCountry === 'worldwide'
        ? 'https://disease.sh/v3/covid-19/all'
        : ` https://disease.sh/v3/covid-19/countries/${selectedCountry}`

    // FETCH DATA BASED ON SPECIFIC COUNTRY
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(selectedCountry)
        setCountryInfo(data)
        setMapCenter([data.countryInfo.lat, data.countryInfo.long])
        setMapZoom(4)
      })
  }
  return (
    <React.Fragment>
      <div id='overlayer'>
        <span className='loader'>
          <span className='loader-inner'></span>
        </span>
      </div>

      {!loading && (
        <div>
          {/* HERO */}

          <div className='app__banner'>
            <div className='app__imageContainer'></div>
            <div className='app__info'>
              <h2 className='app__bannerTitle'>
                Coronavirus disease (COVID-19) pandemic
              </h2>
              <h3>Get (real-time) global covid-19 details </h3>
            </div>
          </div>

          <div className='app'>
            {/* LEFT SIDE */}
            <div className='app__left'>
              {/* HEADER */}
              <div className='app__header'>
                <h2>COVID-19 TRACKER</h2>
                <FormControl className='app__dropdown'>
                  <Select
                    variant='outlined'
                    value={country}
                    onChange={handleChange}
                  >
                    <MenuItem value='worldwide'>Worldwide</MenuItem>
                    {countries.map((country, index) => {
                      return (
                        <MenuItem value={country.value} key={index}>
                          {country.name}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </div>

              {/* STATS  */}
              <div className='app__stats'>
                <InfoBox
                  onClick={() => setCasesType('cases')}
                  title='Coronavirus cases  '
                  cases={prettyPrintStat(countryInfo.todayCases)}
                  total={prettyPrintStat(countryInfo.cases)}
                  active={casesType === 'cases'}
                  isLightRed
                />
                <InfoBox
                  onClick={() => setCasesType('recovered')}
                  title='Recovered '
                  cases={prettyPrintStat(countryInfo.todayRecovered)}
                  total={prettyPrintStat(countryInfo.recovered)}
                  active={casesType === 'recovered'}
                />
                <InfoBox
                  onClick={() => setCasesType('deaths')}
                  title='Deaths '
                  cases={prettyPrintStat(countryInfo.todayDeaths)}
                  total={prettyPrintStat(countryInfo.deaths)}
                  active={casesType === 'deaths'}
                  isRed
                />
              </div>

              {/* MAP */}
              <Map
                center={mapCenter}
                zoom={mapZoom}
                countries={mapCountries}
                casesType={casesType}
              />
            </div>

            {/* RIGHT SIDE  */}
            <Card className='app__right'>
              <CardContent>
                <h3>Live cases by Country</h3>
                <Table countries={tableData} />
                <h3 className='app__rightCases'>Worldwide new {casesType}</h3>
                <LineGraph casesType={casesType} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

export default App
