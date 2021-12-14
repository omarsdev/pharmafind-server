"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "Days",
      [
        {
          id: 1,
          name: "Sunday",
          createdAt: "2021-11-07T14:25:32.132Z",
          updatedAt: "2021-11-07T14:25:32.132Z",
        },
        {
          id: 2,
          name: "Monday",
          createdAt: "2021-11-07T14:25:32.132Z",
          updatedAt: "2021-11-07T14:25:32.132Z",
        },
        {
          id: 3,
          name: "Tuesday",
          createdAt: "2021-11-07T14:25:32.132Z",
          updatedAt: "2021-11-07T14:25:32.132Z",
        },
        {
          id: 4,
          name: "Wednesday",
          createdAt: "2021-11-07T14:25:32.132Z",
          updatedAt: "2021-11-07T14:25:32.132Z",
        },
        {
          id: 5,
          name: "Thursday",
          createdAt: "2021-11-07T14:25:32.132Z",
          updatedAt: "2021-11-07T14:25:32.132Z",
        },
        {
          id: 6,
          name: "Friday",
          createdAt: "2021-11-07T14:25:32.132Z",
          updatedAt: "2021-11-07T14:25:32.132Z",
        },
        {
          id: 7,
          name: "Saturday",
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
    await queryInterface.bulkDelete("Days", null, {});
  },
};
