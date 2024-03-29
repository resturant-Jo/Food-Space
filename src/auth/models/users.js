'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET || 'secretstring';

const userModel = (sequelize, DataTypes) => {
  const model = sequelize.define('Users', {
    username: { type: DataTypes.STRING, required: true, unique: true, allowNull: false },
    firstname: { type: DataTypes.STRING, required: true, allowNull: false },
    lastname: { type: DataTypes.STRING, required: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false, validate: { isEmail: true } },
    gender: { type: DataTypes.ENUM('male', 'female'), required: false ,defaultValue:'male'},
    age: { type: DataTypes.INTEGER, required: false, allowNull: false ,defaultValue: 0},
    adress: { type: DataTypes.STRING, required: false, allowNull: false ,defaultValue: '' },
    profilePicture: {
      type: DataTypes.STRING,
      defaultValue:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQKpiFXNibuHIcJpUpot_YgS55ywsPHhSiEA&usqp=CAU",
        required: false
    },
    phone: { type: DataTypes.INTEGER, required: false },
    password: { type: DataTypes.STRING, required: true, allowNull: false },

    role: { type: DataTypes.ENUM('user', 'driver', 'admin'), required: true, defaultValue: 'user' },
     token: {
      type: DataTypes.VIRTUAL,
      get() {
        return jwt.sign(
          { username: this.username, capabilities: this.capabilities,userId:this.id,role:this.role },
          SECRET
        );
      },
      set(tokenObj) {
        let token = jwt.sign(tokenObj, SECRET);
        return token;
      },
    },
    capabilities: {
      type: DataTypes.VIRTUAL,
      get() {
        const acl = {
          user: ['read','user'],
          driver: ['read','driver'],
          // manager: ['read', 'create','update'],
          admin: ['read', 'create', 'update', 'delete']
        };
        return acl[this.role];
      }
    }
  });

  model.beforeCreate(async (user) => {
    let hashedPass = await bcrypt.hash(user.password, 10);
    user.password = hashedPass;
  });

  model.beforeUpdate(async (user) => {
    let hashedPass = await bcrypt.hash(user.password, 10);
    user.password = hashedPass;
  });

  model.authenticateBasic = async function (username, password) {
    const user = await this.findOne({ where: { username } });
    const valid = await bcrypt.compare(password, user.password);
    if (valid) { return user; }
    throw new Error('Invalid User');
  };

  model.authenticateToken = async function (token) {
    try {
      const parsedToken = jwt.verify(token, SECRET);
      const user = this.findOne({ where: { username: parsedToken.username } });
      if (user) { return user; }
      throw new Error("User Not Found");
    } catch (e) {
      throw new Error(e.message)
    }
  };

  return model;
}

module.exports = userModel;