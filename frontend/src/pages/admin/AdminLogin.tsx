const AdminLogin = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Connexion Administrateur
        </h1>

        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="border p-2 rounded"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
