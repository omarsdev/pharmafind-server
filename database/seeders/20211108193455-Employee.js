"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('Employees', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "Employees",
      [
        {
          id: 1,
          firstName: "Omar",
          lastName: "Sukarieh",
          email: "omarsukarieh99@gmail.com",
          phoneNumber: "+963958744947",
          password: bcrypt.hashSync("secret", 10),
          createdAt: "2021-11-07T14:25:32.132Z",
          updatedAt: "2021-11-07T14:25:32.132Z",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
