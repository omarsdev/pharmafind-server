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
      "ScheduleTimes",
      [
        {
          id: 1,
          startDate: "8:00:00",
          endDate: "14:00:00",
          createdAt: "2021-11-07T14:25:32.132Z",
          updatedAt: "2021-11-07T14:25:32.132Z",
        },
        {
          id: 2,
          startDate: "15:00:00",
          endDate: "21:00:00",
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
    await queryInterface.bulkDelete("ScheduleTimes", null, {});
  },
};
