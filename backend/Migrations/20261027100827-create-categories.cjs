'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {

    await queryInterface.createTable("categories", {

      id:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
      },

      name:{
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
      },

      image:{
        type: Sequelize.STRING,
        allowNull:true
      },

      status:{
        type: Sequelize.BOOLEAN,
        defaultValue:true
      },

      createdAt:{
        allowNull:false,
        type: Sequelize.DATE
      },

      updatedAt:{
        allowNull:false,
        type: Sequelize.DATE
      }

    });

  },


  async down(queryInterface) {

    await queryInterface.dropTable("categories");

  }

};