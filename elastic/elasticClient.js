const { Client } = require('@elastic/elasticsearch')
const fs = require('fs')
const path = require('path');

let client = null;

function initializeESClient(){
  try
  {
    client = new Client({
      node: process.env.ELASTIC_HOST,
      auth: {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD
      },
      tls: {
        ca: fs.readFileSync(path.join(__dirname, process.env.ELASTIC_CERT_NAME)),
        rejectUnauthorized: false
      }
    });
  }
  catch (err)
  {
    console.log('Error while initializing the connection to ElasticSearch.')
    console.log(err);
  }
}

async function indexData({itemId, title, description, content, slug}){
  try
  {
    await client.index({
      index: process.env.ELASTIC_INDEX_NAME,
      id: itemId,
      document: {
        slug, content, description, title
      }
    })
  
    await client.indices.refresh({ index: process.env.ELASTIC_INDEX_NAME });
  }
  catch(err){
    console.log('Error encountered while indexing data to ElasticSearch.')
    console.log(err);
    throw err;
  }
}

async function removeIndexedData({itemId}) {
  try
  {
    await client.delete({
      index: process.env.ELASTIC_INDEX_NAME,
      id: itemId
    });
    await client.indices.refresh({ index: process.env.ELASTIC_INDEX_NAME });  
  }
  catch(err){
      console.log('Error encountered while removing indexed data from ElasticSearch.')
      throw err;
  }
}

async function searchData(searchTerm){
  try
  {
    const result= await client.search({
      index: process.env.ELASTIC_INDEX_NAME,
      query: {
        bool : {
          "should" : [
            {
              "match" : {
                "content" : searchTerm
              }
            },
            {
              "match" : {
                "title" : {"query" : searchTerm, boost: 3}
              }
            },
            {
              "match" : {
                "description" : {"query" : searchTerm, boost: 2}
              }
            }
          ]
        }
      }
    });
    return result;
  }
  catch(err)
  {
    console.log('Search : elasticClient.searchData : Error encountered while making a search request to ElasticSearch.')
    throw err;
  }
}

module.exports = {
    searchData,
    initializeESClient,
    indexData,
    removeIndexedData
}
