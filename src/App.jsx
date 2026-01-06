import { useEffect, useState } from 'react';

function App() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null); // State untuk menyimpan film yang diklik
  const [page, setPage] = useState(1);
  
  const API_KEY = "8c25e3f10a23f8e4125ea64406f6a013"; 

  const getMovies = async (query = "", pageNumber = 1) => {
  try {
    const url = query 
      ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&page=${pageNumber}`
      : `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${pageNumber}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.results) {
      // Jika halaman 1, ganti list. Jika halaman > 1, gabungkan (append)
      setMovies(prev => pageNumber === 1 ? data.results : [...prev, ...data.results]);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

  useEffect(() => { getMovies(); }, []);

  return (
    <div className="bg-slate-900 min-h-screen text-white font-sans relative">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-slate-800/90 backdrop-blur-md p-6 shadow-2xl flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-6">MOVIE-PEDIA</h1>
        <input 
          type="text"
          placeholder="Cari film favorit..."
          className="w-full max-w-md p-3 rounded-full bg-slate-700 border border-slate-600 focus:ring-2 ring-blue-500 outline-none"
          onChange={(e) => { setSearch(e.target.value); getMovies(e.target.value); }}
        />
      </header>

      {/* Daftar Film */}
      <main className="p-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {movies.map((m) => (
          <div 
            key={m.id} 
            onClick={() => setSelectedMovie(m)} // Event Klik di sini
            className="cursor-pointer bg-slate-800 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300"
          >
            <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} alt={m.title} className="w-full h-72 object-cover" />
            <div className="p-3">
              <h3 className="font-bold text-xs truncate">{m.title}</h3>
              <p className="text-yellow-400 text-[10px] mt-1">⭐ {m.vote_average.toFixed(1)}</p>
            </div>
          </div>
        ))}
                    {/* Tombol Load More */}
{!search && (
  <div className="flex justify-center pb-10">
    <button 
      onClick={() => {
        const nextPage = page + 1;
        setPage(nextPage);
        getMovies("", nextPage);
      }}
      className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-blue-500/20"
    >
      Muat Lebih Banyak Film
    </button>
  </div>
)}
      </main>

      {/* --- MODAL DETAIL FILM (Akan muncul jika selectedMovie tidak null) --- */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-800 w-full max-w-2xl rounded-3xl overflow-hidden relative shadow-2xl border border-slate-700">
            {/* Tombol Close */}
            <button 
              onClick={() => setSelectedMovie(null)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full z-10"
            >
              ✕
            </button>

            {/* Gambar Backdrop */}
            <img 
              src={`https://image.tmdb.org/t/p/w1280${selectedMovie.backdrop_path}`} 
              className="w-full h-64 object-cover opacity-50"
            />

            <div className="p-8 -mt-20 relative">
              <div className="flex gap-6 items-end">
                <img 
                  src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`} 
                  className="w-32 rounded-xl shadow-2xl border-2 border-slate-700"
                />
                <div>
                  <h2 className="text-3xl font-bold">{selectedMovie.title}</h2>
                  <p className="text-blue-400">{selectedMovie.release_date}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-lg font-bold text-cyan-400 mb-2">Sinopsis</h4>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {selectedMovie.overview || "Sinopsis tidak tersedia untuk film ini."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;