import { useState } from 'react';
import { 
  FileText, BarChart2, Calendar, Printer, Download, 
  Filter, ChevronDown, ChevronUp, Package, Users, DollarSign, 
  AlertCircle, List 
} from 'lucide-react';
import { TopBar, NavBar, Footer, FarmaButton } from './Components';

// Tipos de reportes con íconos y colores
const REPORT_TYPES = [
  { id: 'all', name: 'Todos', icon: <FileText />, color: 'gray' },
  { id: 'sales', name: 'Ventas', icon: <BarChart2 />, color: 'blue' },
  { id: 'inventory', name: 'Inventario', icon: <Package />, color: 'green' },
  { id: 'customers', name: 'Clientes', icon: <Users />, color: 'purple' },
  { id: 'financial', name: 'Financieros', icon: <DollarSign />, color: 'yellow' },
  { id: 'alerts', name: 'Alertas', icon: <AlertCircle />, color: 'red' }
];

// Datos de ejemplo para reportes
const REPORTS_DATA = [
  {
    id: 1,
    name: 'Reporte de Ventas Diarias',
    type: 'sales',
    category: 'Detallado',
    period: '2024-05-01 a 2024-05-31',
    size: '2.5 MB',
    format: 'PDF',
    date: '2024-05-31T18:30:00'
  },
  {
    id: 2,
    name: 'Inventario Actual',
    type: 'inventory',
    category: 'Resumen',
    period: 'Al 2024-05-31',
    size: '1.8 MB',
    format: 'Excel',
    date: '2024-05-31T09:15:00'
  },
  {
    id: 3,
    name: 'Top 10 Productos',
    type: 'sales',
    category: 'Gráfico',
    period: '2024-01-01 a 2024-05-31',
    size: '3.2 MB',
    format: 'PDF',
    date: '2024-05-30T14:45:00'
  }
];

export default function Reportes() {
  const [reports] = useState(REPORTS_DATA);
  const [selectedType, setSelectedType] = useState('all');
  const [filters, setFilters] = useState({
    category: 'Todos',
    format: 'Todos',
    dateFrom: '',
    dateTo: '',
    searchTerm: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Filtrar reportes
  const filteredReports = reports.filter(report => {
    const matchesType = selectedType === 'all' || report.type === selectedType;
    const matchesCategory = filters.category === 'Todos' || report.category === filters.category;
    const matchesFormat = filters.format === 'Todos' || report.format === filters.format;
    const matchesSearch = filters.searchTerm === '' || 
      report.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    // Filtrado por fecha
    let matchesDate = true;
    if (filters.dateFrom && new Date(report.date) < new Date(filters.dateFrom)) {
      matchesDate = false;
    }
    if (filters.dateTo && new Date(report.date) > new Date(filters.dateTo)) {
      matchesDate = false;
    }
    
    return matchesType && matchesCategory && matchesFormat && matchesSearch && matchesDate;
  });

  // Manejar cambio de filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      category: 'Todos',
      format: 'Todos',
      dateFrom: '',
      dateTo: '',
      searchTerm: ''
    });
  };

  // Obtener color para tipos
  const getColorClass = (type) => {
    const colorMap = {
      sales: 'blue',
      inventory: 'green',
      customers: 'purple',
      financial: 'yellow',
      alerts: 'red'
    };
    return colorMap[type] || 'gray';
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopBar />
      <NavBar />

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Encabezado */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
              <BarChart2 className="h-8 w-8 mr-3 text-blue-600" />
              Reportes del Sistema
            </h1>
            <p className="mt-2 text-gray-600">
              Visualiza y descarga los reportes generados por el sistema
            </p>
          </div>

          {/* Selector visual de tipos */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Selecciona el tipo de reporte</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {REPORT_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                    selectedType === type.id 
                      ? `bg-${type.color}-100 border-${type.color}-300 shadow-inner` 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-full mb-2 text-${type.color}-600`}>
                    {type.icon}
                  </div>
                  <span className="text-sm font-medium">{type.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filtros y controles */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar reportes por nombre..."
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
              </div>
            </div>

            {/* Filtros avanzados */}
            {showFilters && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="Todos">Todas las categorías</option>
                    <option value="Detallado">Detallado</option>
                    <option value="Resumen">Resumen</option>
                    <option value="Gráfico">Gráfico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Formato</label>
                  <select
                    name="format"
                    value={filters.format}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="Todos">Todos los formatos</option>
                    <option value="PDF">PDF</option>
                    <option value="Excel">Excel</option>
                    <option value="CSV">CSV</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                    <input
                      type="date"
                      name="dateFrom"
                      value={filters.dateFrom}
                      onChange={handleFilterChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                    <input
                      type="date"
                      name="dateTo"
                      value={filters.dateTo}
                      onChange={handleFilterChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                </div>

                <div className="md:col-span-3 flex justify-end space-x-3">
                  <FarmaButton 
                    type="secondary" 
                    onClick={clearFilters}
                    className="w-full md:w-auto"
                  >
                    Limpiar filtros
                  </FarmaButton>
                </div>
              </div>
            )}
          </div>

          {/* Resultados */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium">
                {REPORT_TYPES.find(t => t.id === selectedType)?.name || 'Todos'} los reportes
                <span className="text-sm text-gray-500 ml-2">
                  ({filteredReports.length} resultados)
                </span>
              </h3>
              <div className="flex space-x-2">
                <FarmaButton type="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </FarmaButton>
                <FarmaButton type="primary" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </FarmaButton>
              </div>
            </div>

            {/* Vista de lista */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {report.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{report.format} • {report.size}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${getColorClass(report.type)}-100 text-${getColorClass(report.type)}-800`}>
                          {REPORT_TYPES.find(t => t.id === report.type)?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(report.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <FarmaButton 
                            type="outline" 
                            size="xs"
                            onClick={() => setSelectedReport(report)}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Detalles
                          </FarmaButton>
                          <FarmaButton 
                            type="primary" 
                            size="xs"
                            className="flex items-center"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Descargar
                          </FarmaButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredReports.length === 0 && (
              <div className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No se encontraron reportes</h3>
                <p className="mt-1 text-gray-500">
                  No hay reportes que coincidan con los filtros seleccionados
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal de detalles del reporte */}
      {selectedReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-gray-200 w-full max-w-2xl">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Detalles del Reporte
              </h3>
              <button 
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Nombre</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedReport.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Tipo</h4>
                  <p className="mt-1">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${getColorClass(selectedReport.type)}-100 text-${getColorClass(selectedReport.type)}-800`}>
                      {REPORT_TYPES.find(t => t.id === selectedReport.type)?.name}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Categoría</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedReport.category}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Formato</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedReport.format}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Periodo</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedReport.period}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Tamaño</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedReport.size}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Fecha de generación</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(selectedReport.date)}
                </p>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <FarmaButton 
                type="outline" 
                onClick={() => setSelectedReport(null)}
              >
                Cerrar
              </FarmaButton>
              <FarmaButton 
                type="primary" 
                className="flex items-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Descargar Reporte
              </FarmaButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}