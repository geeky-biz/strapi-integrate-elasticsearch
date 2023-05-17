module.exports = {
  routes: [
    {
     method: 'GET',
     path: '/search',
     handler: 'search.performSearch',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
