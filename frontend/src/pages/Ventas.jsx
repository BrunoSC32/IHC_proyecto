import { useState } from 'react';
import { Search, Download, Filter, ChevronDown, ChevronUp, Plus, Edit, Trash2, ShoppingCart, Receipt, User, CreditCard, Calendar, Clock } from 'lucide-react';
import { TopBar, NavBar, Footer, FarmaButton } from './Components';

// Datos de ejemplo para las ventas
const VENTAS_EJEMPLO = [
  {
    id: 1,
    codigo: 'VEN-001',
    fecha: '2024-05-15',
    hora: '10:30',
    cliente: 'Juan Pérez',
    productos: [
      { id: 1, nombre: 'Paracetamol 500mg', cantidad: 2, precio: 5.20 },
      { id: 5, nombre: 'Loratadina 10mg', cantidad: 1, precio: 6.40 }
    ],
    total: 16.80,
    metodoPago: 'efectivo',
    estado: 'completada'
  },
  {
    id: 2,
    codigo: 'VEN-002',
    fecha: '2024-05-16',
    hora: '15:45',
    cliente: 'María Gómez',
    productos: [
      { id: 2, nombre: 'Ibuprofeno 400mg', cantidad: 3, precio: 7.50 },
      { id: 3, nombre: 'Amoxicilina 500mg', cantidad: 1, precio: 12.80 }
    ],
    total: 35.30,
    metodoPago: 'tarjeta',
    estado: 'completada'
  },
  {
    id: 3,
    codigo: 'VEN-003',
    fecha: '2024-05-17',
    hora: '09:15',
    cliente: 'Carlos Rodríguez',
    productos: [
      { id: 1, nombre: 'Paracetamol 500mg', cantidad: 1, precio: 5.20 },
      { id: 4, nombre: 'Omeprazol 20mg', cantidad: 2, precio: 8.90 }
    ],
    total: 23.00,
    metodoPago: 'transferencia',
    estado: 'cancelada'
  },
  {
    id: 4,
    codigo: 'VEN-004',
    fecha: '2024-05-18',
    hora: '11:20',
    cliente: 'Ana Fernández',
    productos: [
      { id: 5, nombre: 'Loratadina 10mg', cantidad: 2, precio: 6.40 }
    ],
    total: 12.80,
    metodoPago: 'efectivo',
    estado: 'completada'
  },
  {
    id: 5,
    codigo: 'VEN-005',
    fecha: '2024-05-19',
    hora: '16:30',
    cliente: 'Pedro López',
    productos: [
      { id: 3, nombre: 'Amoxicilina 500mg', cantidad: 1, precio: 12.80 },
      { id: 2, nombre: 'Ibuprofeno 400mg', cantidad: 2, precio: 7.50 }
    ],
    total: 27.80,
    metodoPago: 'tarjeta',
    estado: 'pendiente'
  }
];

const METODOS_PAGO = ['efectivo', 'tarjeta', 'transferencia'];
const ESTADOS_VENTA = ['completada', 'pendiente', 'cancelada'];

export default function Ventas() {
  const [ventas, setVentas] = useState(VENTAS_EJEMPLO);
  const [filters, setFilters] = useState({
    searchTerm: '',
    fechaDesde: '',
    fechaHasta: '',
    metodoPago: 'all',
    estado: 'all',
    totalMin: '',
    totalMax: '',
    sortBy: 'fecha',
    sortOrder: 'desc'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentVenta, setCurrentVenta] = useState(null);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [ventaDetalle, setVentaDetalle] = useState(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredVentas = ventas.filter(venta => {
    const fechaVenta = new Date(venta.fecha);
    const desde = filters.fechaDesde ? new Date(filters.fechaDesde) : null;
    const hasta = filters.fechaHasta ? new Date(filters.fechaHasta) : null;
    
    return (
      (filters.searchTerm === '' || 
       venta.cliente.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
       venta.codigo.toLowerCase().includes(filters.searchTerm.toLowerCase())) &&
      (!filters.fechaDesde || fechaVenta >= desde) &&
      (!filters.fechaHasta || fechaVenta <= hasta) &&
      (filters.metodoPago === 'all' || venta.metodoPago === filters.metodoPago) &&
      (filters.estado === 'all' || venta.estado === filters.estado) &&
      (filters.totalMin === '' || venta.total >= parseFloat(filters.totalMin)) &&
      (filters.totalMax === '' || venta.total <= parseFloat(filters.totalMax))
    );
  }).sort((a, b) => {
    const order = filters.sortOrder === 'asc' ? 1 : -1;
    
    if (a[filters.sortBy] < b[filters.sortBy]) return -1 * order;
    if (a[filters.sortBy] > b[filters.sortBy]) return 1 * order;
    return 0;
  });

  const getStatusBadge = (status) => {
    const badges = {
      'completada': 'bg-green-100 text-green-800',
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'cancelada': 'bg-red-100 text-red-800'
    };
    
    const texts = {
      'completada': 'Completada',
      'pendiente': 'Pendiente',
      'cancelada': 'Cancelada'
    };
    
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badges[status] || 'bg-gray-100 text-gray-800'}`}>
        {texts[status] || status}
      </span>
    );
  };

  const getPaymentBadge = (metodo) => {
    const badges = {
      'efectivo': 'bg-blue-100 text-blue-800',
      'tarjeta': 'bg-purple-100 text-purple-800',
      'transferencia': 'bg-indigo-100 text-indigo-800'
    };
    
    const texts = {
      'efectivo': 'Efectivo',
      'tarjeta': 'Tarjeta',
      'transferencia': 'Transferencia'
    };
    
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badges[metodo] || 'bg-gray-100 text-gray-800'}`}>
        {texts[metodo] || metodo}
      </span>
    );
  };

  const handleEditVenta = (venta) => {
    setCurrentVenta(venta);
    setShowModal(true);
  };

  const handleDeleteVenta = (id) => {
    setVentas(ventas.filter(v => v.id !== id));
  };

  const handleAddVenta = () => {
    setCurrentVenta(null);
    setShowModal(true);
  };

  const handleSaveVenta = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newVenta = {
      id: currentVenta ? currentVenta.id : ventas.length + 1,
      codigo: `VEN-${(ventas.length + 1).toString().padStart(3, '0')}`,
      fecha: formData.get('fecha'),
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      cliente: formData.get('cliente'),
      productos: currentVenta?.productos || [],
      total: currentVenta?.total || 0,
      metodoPago: formData.get('metodoPago'),
      estado: formData.get('estado')
    };

    if (currentVenta) {
      setVentas(ventas.map(v => v.id === currentVenta.id ? newVenta : v));
    } else {
      setVentas([...ventas, newVenta]);
    }

    setShowModal(false);
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      fechaDesde: '',
      fechaHasta: '',
      metodoPago: 'all',
      estado: 'all',
      totalMin: '',
      totalMax: '',
      sortBy: 'fecha',
      sortOrder: 'desc'
    });
  };

  const showDetalleVenta = (venta) => {
    setVentaDetalle(venta);
    setShowDetalleModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Componentes reutilizables */}
      <TopBar />
      <NavBar />

      {/* Contenido principal */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-6 w-full bg-white">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <ShoppingCart className="h-6 w-6 mr-2 text-blue-600" />
            Registro de Ventas
          </h1>
          <p className="text-gray-600">Administra las ventas realizadas en la farmacia</p>
        </div>
        
        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por cliente o código..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange({ target: { name: 'searchTerm', value: e.target.value } })}
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-gray-700"
              >
                <Filter className="h-5 w-5 mr-2" />
                Filtros
                {showFilters ? <ChevronUp className="h-5 w-5 ml-1" /> : <ChevronDown className="h-5 w-5 ml-1" />}
              </button>

              <FarmaButton 
                type="primary" 
                onClick={handleAddVenta}
                className="flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nueva Venta
              </FarmaButton>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label>
                <input
                  type="date"
                  name="fechaDesde"
                  value={filters.fechaDesde}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha hasta</label>
                <input
                  type="date"
                  name="fechaHasta"
                  value={filters.fechaHasta}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Método de pago</label>
                <select
                  name="metodoPago"
                  value={filters.metodoPago}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="all">Todos los métodos</option>
                  {METODOS_PAGO.map(metodo => (
                    <option key={metodo} value={metodo}>{metodo.charAt(0).toUpperCase() + metodo.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  name="estado"
                  value={filters.estado}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="all">Todos los estados</option>
                  {ESTADOS_VENTA.map(est => (
                    <option key={est} value={est}>{est.charAt(0).toUpperCase() + est.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total mínimo</label>
                  <input
                    type="number"
                    name="totalMin"
                    value={filters.totalMin}
                    onChange={handleFilterChange}
                    placeholder="Mínimo"
                    step="0.01"
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total máximo</label>
                  <input
                    type="number"
                    name="totalMax"
                    value={filters.totalMax}
                    onChange={handleFilterChange}
                    placeholder="Máximo"
                    step="0.01"
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="fecha">Fecha</option>
                  <option value="codigo">Código</option>
                  <option value="cliente">Cliente</option>
                  <option value="total">Total</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                <select
                  name="sortOrder"
                  value={filters.sortOrder}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="desc">Más reciente primero</option>
                  <option value="asc">Más antiguo primero</option>
                </select>
              </div>

              <div className="md:col-span-2 flex items-end">
                <FarmaButton 
                  type="secondary" 
                  onClick={clearFilters}
                  className="w-full"
                >
                  Limpiar filtros
                </FarmaButton>
              </div>
            </div>
          )}
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Receipt className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Total Ventas</h3>
                <p className="text-2xl font-bold text-blue-600">{ventas.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Completadas</h3>
                <p className="text-2xl font-bold text-green-600">
                  {ventas.filter(v => v.estado === 'completada').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Pendientes</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {ventas.filter(v => v.estado === 'pendiente').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Ingresos Totales</h3>
                <p className="text-2xl font-bold text-purple-600">
                  Bs. {ventas.filter(v => v.estado === 'completada').reduce((sum, v) => sum + v.total, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Mostrando {filteredVentas.length} de {ventas.length} ventas
          </p>
          <button
            onClick={() => window.print()}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <Download className="h-4 w-4 mr-1" />
            Exportar reporte
          </button>
        </div>

        {/* Tabla de ventas */}
        {filteredVentas.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No se encontraron ventas con los filtros aplicados</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (Bs.)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pago</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVentas.map((venta) => (
                    <tr key={venta.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 font-medium">
                        {venta.codigo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(venta.fecha).toLocaleDateString('es-ES')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {venta.hora}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {venta.cliente}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {venta.productos.length} producto(s)
                        </div>
                        <button 
                          onClick={() => showDetalleVenta(venta)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Ver detalles
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {venta.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPaymentBadge(venta.metodoPago)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(venta.estado)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            onClick={() => handleEditVenta(venta)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar venta"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteVenta(venta.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar venta"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modal para agregar/editar venta */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-gray-200 w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {currentVenta ? 'Editar Venta' : 'Registrar Nueva Venta'}
              </h3>
            </div>
            <form onSubmit={handleSaveVenta}>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    name="fecha"
                    defaultValue={currentVenta?.fecha || new Date().toISOString().split('T')[0]}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                  <input
                    type="text"
                    name="cliente"
                    defaultValue={currentVenta?.cliente || ''}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
                  <select
                    name="metodoPago"
                    defaultValue={currentVenta?.metodoPago || 'efectivo'}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    {METODOS_PAGO.map(metodo => (
                      <option key={metodo} value={metodo}>{metodo.charAt(0).toUpperCase() + metodo.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    name="estado"
                    defaultValue={currentVenta?.estado || 'completada'}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    {ESTADOS_VENTA.map(est => (
                      <option key={est} value={est}>{est.charAt(0).toUpperCase() + est.slice(1)}</option>
                    ))}
                  </select>
                </div>
                {currentVenta && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Productos</h4>
                    <ul className="space-y-2">
                      {currentVenta.productos.map((producto, index) => (
                        <li key={index} className="flex justify-between text-sm">
                          <span>{producto.nombre}</span>
                          <span>{producto.cantidad} x Bs. {producto.precio.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 pt-2 border-t border-gray-200 text-right font-medium">
                      Total: Bs. {currentVenta.total.toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <FarmaButton 
                  type="outline" 
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </FarmaButton>
                <FarmaButton 
                  type="primary" 
                >
                  Guardar
                </FarmaButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para detalle de venta */}
      {showDetalleModal && ventaDetalle && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-gray-200 w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Detalle de Venta {ventaDetalle.codigo}
              </h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(ventaDetalle.fecha).toLocaleDateString('es-ES')} {ventaDetalle.hora}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p className="text-sm font-medium text-gray-900">{ventaDetalle.cliente}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Método de Pago</p>
                <div className="mt-1">
                  {getPaymentBadge(ventaDetalle.metodoPago)}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <div className="mt-1">
                  {getStatusBadge(ventaDetalle.estado)}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Productos</h4>
                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                  {ventaDetalle.productos.map((producto, index) => (
                    <li key={index} className="px-4 py-3 flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{producto.nombre}</p>
                        <p className="text-sm text-gray-500">{producto.cantidad} unidades</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        Bs. {(producto.cantidad * producto.precio).toFixed(2)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between text-sm font-medium text-gray-900">
                  <span>Subtotal</span>
                  <span>Bs. {ventaDetalle.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-900 mt-1 pt-1 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-lg">Bs. {ventaDetalle.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <FarmaButton 
                type="primary" 
                onClick={() => setShowDetalleModal(false)}
              >
                Cerrar
              </FarmaButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}