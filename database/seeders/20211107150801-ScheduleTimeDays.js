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
      "ScheduleTimeDays",
      [
        {
          id: 0,
          schedule_time_id: 1,
          day_id: 1,
          createdAt: "2021-11-07T14:25:32.132Z",
          updatedAt: "2021-11-07T14:25:32.132Z",
        },
        {
          id: 1,
          schedule_time_id: 2,
          day_id: 1,
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
    await queryInterface.bulkDelete("ScheduleTimeDays", null, {});
  },
};
