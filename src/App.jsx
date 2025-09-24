import { useEffect, useState } from 'react'
import Header from './components/Header'
import Table from './components/Table'
import { getData } from './api'

function App() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("All");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await getData();
        setCountries(data);
      } catch (err) {
        console.error("Error fetching countries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const regions = Array.from(new Set(countries.map(c => c?.region).filter(Boolean))).sort();
  const filtered = selectedRegion === "All" ? countries : countries.filter(c => c?.region === selectedRegion);
  
  return (
    <div className='flex flex-col gap-4'>
      <Header regions={regions} selectedRegion={selectedRegion} onSelect={setSelectedRegion} />
      <Table data={filtered} loading={loading} />
    </div>
  )
}

export default App
