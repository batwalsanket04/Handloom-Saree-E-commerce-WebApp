'use strict';

/**
 * Migration: add categoryId foreign key + price index to sarees table
 *
 * Supports server-side filtering by admin-managed categories (categoryId ->
 * categories.id) and by price, plus fast pagination lookups.
 *
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize')} Sequelize
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("sarees", "categoryId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: "categories", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      comment: "Reference to admin-managed Category table",
    });

    await queryInterface.addIndex("sarees", ["categoryId"]);
    await queryInterface.addIndex("sarees", ["price"]);
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("sarees", ["categoryId"]);
    await queryInterface.removeIndex("sarees", ["price"]);
    await queryInterface.removeColumn("sarees", "categoryId");
  },
};
