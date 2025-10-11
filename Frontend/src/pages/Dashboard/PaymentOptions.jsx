import React from 'react';
import { useNavigate } from 'react-router-dom';

function PaymentOptions() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-10 max-w-md w-full">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">Pago de Servicios</h1>
        <p className="text-slate-700 mb-8 text-center">Selecciona el proveedor al que deseas realizar el pago:</p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => alert('Redirigir a pago AWS')}
            className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold rounded-lg shadow hover:from-yellow-500 hover:to-yellow-700 transition-all text-lg"
          >
            Pagar AWS
          </button>
          <button
            onClick={() => alert('Redirigir a pago Azure')}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-800 text-white font-semibold rounded-lg shadow hover:from-blue-600 hover:to-blue-900 transition-all text-lg"
          >
            Pagar Azure
          </button>
          <button
            onClick={() => alert('Redirigir a pago Oracle')}
            className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-700 text-white font-semibold rounded-lg shadow hover:from-orange-600 hover:to-red-800 transition-all text-lg"
          >
            Pagar Oracle
          </button>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-8 w-full px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
        >
          Volver
        </button>
      </div>
    </div>
  );
}

export default PaymentOptions;
