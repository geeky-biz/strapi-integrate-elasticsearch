const { performIndexingForSearch } = require('../elastic/cron-search-indexing');
  
module.exports = {
    performIndexingForSearch: {
      task: async({strapi}) => {
        console.log('performIndexingForSearch')
        return await performIndexingForSearch({strapi});
      },
      options: {
        rule: "*/10 * * * * *", //run daily at 11:00 PM
      },
//      options: new Date(Date.now() + 5 * 1000),    //for dev purposes
    }
}