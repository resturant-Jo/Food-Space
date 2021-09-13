'use strict';

const cartModel = (sequelize, DataTypes) => sequelize.define('cart', {
  userId: { type: DataTypes.INTEGER },
  status: { type: DataTypes.BOOLEAN, defaultValue: true},

});

module.exports = cartModel;