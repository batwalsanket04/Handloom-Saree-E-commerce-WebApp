'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up(queryInterface, Sequelize) {

    await queryInterface.createTable("abouts", {

      id:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
      },

      title:{
        type: Sequelize.STRING,
        allowNull:false
      },

      subtitle:{
        type: Sequelize.STRING,
        allowNull:true
      },

      description1:{
        type: Sequelize.TEXT,
        allowNull:true
      },

      description2:{
        type: Sequelize.TEXT,
        allowNull:true
      },

      description3:{
        type: Sequelize.TEXT,
        allowNull:true
      },

      description4:{
        type: Sequelize.TEXT,
        allowNull:true
      },

      image:{
        type: Sequelize.STRING,
        allowNull:true
      },

      imagePublicId:{
        type: Sequelize.STRING,
        allowNull:true
      },

      buttonText:{
        type: Sequelize.STRING,
        defaultValue:"Explore Collection"
      },

      buttonLink:{
        type: Sequelize.STRING,
        defaultValue:"/collection"
      },

      createdAt:{
        type: Sequelize.DATE,
        allowNull:false
      },

      updatedAt:{
        type: Sequelize.DATE,
        allowNull:false
      }

    });

  },


  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable("abouts");

  }

};