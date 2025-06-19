import React from 'react';

import { useState } from 'react';
import { 
  Bell, BellOff, CheckCircle, AlertTriangle, Info, 
  Filter, ChevronDown, ChevronUp, Archive, X 
} from 'lucide-react';
import { TopBar, NavBar, Footer, FarmaButton } from './Components';

// Tipos de notificaciones con íconos y colores
const NOTIFICATION_TYPES = [
  { id: 'todas', name: 'Todas', icon: <Bell />, color: 'gray' },
  { id: 'stock', name: 'Stock', icon: <AlertTriangle />, color: 'yellow' },
  { id: 'vencimiento', name: 'Vencimientos', icon: <AlertTriangle />, color: 'red' },
  { id: 'venta', name: 'Ventas', icon: <CheckCircle />, color: 'green' },
  { id: 'sistema', name: 'Sistema', icon: <Info />, color: 'blue' },
  { id: 'archivadas', name: 'Archivadas', icon: <Archive />, color: 'gray' }
];

// Notificaciones de ejemplo
const SAMPLE_NOTIFICATIONS = [
  {
    id: 1,
    type: 'stock',
    title: 'Stock bajo de Paracetamol',
    message: 'Quedan solo 5 unidades de Paracetamol 500mg',
    date: '2023-06-15T10:30:00',
    read: false,
    archived: false
  },
  {
    id: 2,
    type: 'vencimiento',
    title: 'Producto próximo a vencer',
    message: 'El lote #12345 de Ibuprofeno 400mg vence en 15 días',
    date: '2023-06-14T08:45:00',
    read: true,
    archived: false
  },
  {
    id: 3,
    type: 'venta',
    title: 'Venta registrada exitosamente',
    message: 'Se registró la venta #45678 por $125.000',
    date: '2023-06-13T16:20:00',
    read: false,
    archived: false
  },
  {
    id: 4,
    type: 'sistema',
    title: 'Actualización disponible',
    message: 'Nueva versión 2.3.0 del sistema lista para instalar',
    date: '2023-06-12T11:10:00',
    read: true,
    archived: true
  },
  {
    id: 5,
    type: 'stock',
    title: 'Stock bajo de Amoxicilina',
    message: 'Quedan solo 3 unidades de Amoxicilina 500mg',
    date: '2023-06-10T09:15:00',
    read: false,
    archived: false
  },
  {
    id: 6,
    type: 'venta',
    title: 'Venta cancelada',
    message: 'La venta #45677 fue cancelada por el cliente',
    date: '2023-06-09T14:30:00',
    read: true,
    archived: false
  },
  {
    id: 7,
    type: 'vencimiento',
    title: 'Producto vencido detectado',
    message: 'El lote #12344 de Dipirona 500mg ha vencido',
    date: '2023-06-08T07:50:00',
    read: false,
    archived: false
  },
  {
    id: 8,
    type: 'sistema',
    title: 'Copia de seguridad completada',
    message: 'La copia de seguridad nocturna se completó con éxito',
    date: '2023-06-07T23:45:00',
    read: true,
    archived: false
  }
];

export default function Notificaciones() {
  const [activeTab, setActiveTab] = useState('todas');
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: 'todas',
    dateFrom: '',
    dateTo: '',
    unreadOnly: false
  });

  // Funciones de manejo
  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? {...notif, read: true} : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => 
      !notif.read ? {...notif, read: true} : notif
    ));
  };

  const archiveNotification = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? {...notif, archived: true} : notif
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const resetFilters = () => {
    setFilters({
      type: 'todas',
      dateFrom: '',
      dateTo: '',
      unreadOnly: false
    });
    setActiveTab('todas');
  };

  const applyFilters = () => {
    setShowFilters(false);
  };

  // Filtrar notificaciones
  const filteredNotifications = notifications.filter(notif => {
    // Filtrar por tipo
    if (filters.type !== 'todas' && notif.type !== filters.type) return false;
    
    // Filtrar por archivadas
    if (filters.type === 'archivadas' && !notif.archived) return false;
    if (filters.type !== 'archivadas' && notif.archived) return false;
    
    // Filtrar por no leídas
    if (filters.unreadOnly && notif.read) return false;
    
    // Filtrar por fecha
    if (filters.dateFrom && new Date(notif.date) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(notif.date) > new Date(filters.dateTo)) return false;
    
    return true;
  });

  const unreadCount = notifications.filter(notif => !notif.read && !notif.archived).length;

  const getNotificationIcon = (type) => {
    const typeConfig = NOTIFICATION_TYPES.find(t => t.id === type);
    return typeConfig ? React.cloneElement(typeConfig.icon, { 
      className: `h-5 w-5 text-${typeConfig.color}-500` 
    }) : <Info className="h-5 w-5 text-gray-500" />;
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
              <Bell className="h-8 w-8 mr-3 text-blue-600" />
              Notificaciones
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-sm font-medium px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="mt-2 text-gray-600">Gestiona las alertas y notificaciones del sistema</p>
          </div>

          {/* Selector visual de tipos */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Tipo de notificación</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {NOTIFICATION_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setActiveTab(type.id);
                    setFilters(prev => ({ ...prev, type: type.id }));
                  }}
                  className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                    activeTab === type.id 
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
            <div className="flex justify-between items-center">
              <FarmaButton 
                type="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center"
              >
                <Filter className="h-5 w-5 mr-2" />
                {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
                {showFilters ? <ChevronUp className="h-5 w-5 ml-1" /> : <ChevronDown className="h-5 w-5 ml-1" />}
              </FarmaButton>

              <FarmaButton 
                type="primary" 
                onClick={markAllAsRead}
                className="flex items-center"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Marcar todas como leídas
              </FarmaButton>
            </div>

            {/* Panel de filtros avanzados */}
            {showFilters && (
              <div className="mt-4 p-6 border border-gray-200 rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rango de fechas</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="date"
                          value={filters.dateFrom}
                          onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          placeholder="Desde"
                        />
                      </div>
                      <div>
                        <input
                          type="date"
                          value={filters.dateTo}
                          onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          placeholder="Hasta"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="unreadOnly"
                      checked={filters.unreadOnly}
                      onChange={(e) => setFilters({...filters, unreadOnly: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="unreadOnly" className="ml-2 block text-sm text-gray-700">
                      Mostrar solo no leídas
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <FarmaButton 
                    type="outline" 
                    onClick={resetFilters}
                  >
                    Limpiar filtros
                  </FarmaButton>
                  <FarmaButton 
                    type="primary" 
                    onClick={applyFilters}
                  >
                    Aplicar cambios
                  </FarmaButton>
                </div>
              </div>
            )}
          </div>

          {/* Lista de notificaciones */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium">
                {NOTIFICATION_TYPES.find(t => t.id === activeTab)?.name || 'Todas'} las notificaciones
                <span className="text-sm text-gray-500 ml-2">
                  ({filteredNotifications.length} resultados)
                </span>
              </h3>
            </div>

            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <BellOff className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No hay notificaciones</h3>
                <p className="mt-1 text-gray-500">
                  {activeTab === 'archivadas' 
                    ? "No hay notificaciones archivadas" 
                    : "No hay notificaciones que coincidan con los filtros"}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <li 
                    key={notification.id} 
                    className={`px-6 py-4 ${
                      !notification.read ? 'bg-blue-50' : 'bg-white'
                    } hover:bg-gray-50 transition-colors`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className={`text-base font-medium ${
                            !notification.read ? 'text-blue-800' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(notification.date).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="mt-3 flex space-x-4">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Marcar como leída
                            </button>
                          )}
                          {activeTab !== 'archivadas' && !notification.archived && (
                            <button
                              onClick={() => archiveNotification(notification.id)}
                              className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                            >
                              Archivar
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-sm text-red-600 hover:text-red-800 font-medium"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}