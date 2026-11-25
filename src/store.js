// Almacenamiento en memoria compartido por todos los módulos.
// Cada instancia de la aplicación crea su propio store, lo que mantiene las pruebas aisladas.
function createStore() {
  const counters = {};

  return {
    users: [
      { id: 1, username: 'admin', password: 'admin123', name: 'Administrador' },
      { id: 2, username: 'vendedor', password: 'vendedor123', name: 'Vendedor' },
    ],
    products: [
      { id: 1, name: 'Teclado', price: 25, stock: 10 },
      { id: 2, name: 'Mouse', price: 12.5, stock: 20 },
      { id: 3, name: 'Monitor', price: 180, stock: 5 },
    ],
    customers: [
      { id: 1, name: 'Consumidor final', email: 'consumidor@example.com' },
    ],
    sales: [],
    sessions: new Map(),

    nextId(collection) {
      if (!counters[collection]) {
        counters[collection] = this[collection].reduce((max, item) => Math.max(max, item.id), 0);
      }
      counters[collection] += 1;
      return counters[collection];
    },
  };
}

module.exports = { createStore };
