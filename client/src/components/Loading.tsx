const Loading = () => {
  return (
    <div 
      id="loading-screen" 
      className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900/50 backdrop-blur-xs z-50"
    >
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 animate-spin-slow">
          <i className="fas fa-sun text-yellow-300 text-5xl"></i>
        </div>
        <div className="absolute inset-0 animate-ping">
          <i className="fas fa-cloud text-white text-4xl opacity-50"></i>
        </div>
      </div>
      <p className="mt-4 text-white font-medium">Загрузка данных о погоде...</p>
    </div>
  );
};

export default Loading;
