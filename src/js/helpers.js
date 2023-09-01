import { TIMEOUT_SECONDS } from "./config";
import { SPOONAKULAR_KEY } from "./config";

const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
  };

export const getJSON = async function(url){
    try{
        const response = await Promise.race([timeout(TIMEOUT_SECONDS), fetch(url)]);
        const recievedData = await response.json();
        
        if (recievedData.status !== "success") {
          throw new Error(recievedData.message);
        };
        
        return recievedData;
   
    }catch(error){
        throw error;
    }
};

export const sendJSON = async function(url, dataObject){
  try{
    const fetchPromise = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataObject)
    })
    const response = await Promise.race([timeout(TIMEOUT_SECONDS), fetchPromise]);
    const recievedData = await response.json();

    
    if (recievedData.status !== "success") {
      throw new Error(recievedData.message);
    };

    return recievedData;
  }catch(error){
    throw error;
  }
};

export const AJAX = async function(url, dataObject = undefined){
  try {
    const fetchPromise = 
    dataObject ? 
    fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataObject)
    })
    : 
  fetch(url);

  const response = await Promise.race([timeout(TIMEOUT_SECONDS), fetchPromise]);
  const recievedData = await response.json();
  
  if (recievedData.status !== "success") {
    throw new Error(recievedData.message);
  }
  
  return recievedData;
  
}catch(error){
    throw new Error(error);
}
}

export const externalAPICall = async function(string, key) {
  try{
      const fetchPromise = fetch(`https://api.spoonacular.com/recipes/parseIngredients?ingredientList=${string}&includeNutrition=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-api-key' : `${key}`
        },
      })
      const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SECONDS)]);
      const recievedData = await response.json();
  
      if (!recievedData) {
        throw new Error(recievedData.message);
      };
      return recievedData;
    
    }catch(error){
      throw new Error(error);
    }
}




// 0
// : 
// {name: 'Vitamin B6', amount: 0.04, unit: 'mg', percentOfDailyNeeds: 1.86}
// 1
// : 
// {name: 'Caffeine', amount: 0, unit: 'mg', percentOfDailyNeeds: 0}
// 2
// : 
// {name: 'Sugar', amount: 0.03, unit: 'g', percentOfDailyNeeds: 0.03}
// 3
// : 
// {name: 'Selenium', amount: 0.43, unit: 'µg', percentOfDailyNeeds: 0.61}
// 4
// : 
// {name: 'Vitamin C', amount: 0.94, unit: 'mg', percentOfDailyNeeds: 1.13}
// 5
// : 
// {name: 'Protein', amount: 0.19, unit: 'g', percentOfDailyNeeds: 0.38}
// 6
// : 
// {name: 'Calcium', amount: 5.43, unit: 'mg', percentOfDailyNeeds: 0.54}