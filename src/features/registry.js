// Relaciona cada característica del modelo con el módulo que la implementa.
// Una característica habilitada sin módulo registrado se considera una configuración inválida.
module.exports = {
  login: require('../modules/auth'),
  productos: require('../modules/products'),
  clientes: require('../modules/customers'),
  ventas: require('../modules/sales'),
};
