const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-8">Page Not Found</p>
        <a
          href="/"
          className="inline-block px-8 py-3 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
