'use strict';

const express = require('express');
const dataModules = require('../models');
const bearerAuth = require('../middleware/bearerAuth');


const router = express.Router();

router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next('Invalid Model');
  }
});

router.get('/:model',bearerAuth, handleGetAll);
router.get('/:model/:id',bearerAuth, handleGetOne);
router.post('/:model',bearerAuth, handleCreate);
router.put('/:model/:id',bearerAuth, handleUpdate);
router.delete('/:model/:id',bearerAuth, handleDelete);

async function handleGetAll(req, res) {
  const id = req.params.id;
  let allRecords = await req.model.get(id);
  console.log(dataModules.food);
  let data;
   let allFood= await Promise.all(allRecords.map( async(ele) => {
    data = await dataModules.food.getfav(parseInt(ele.foodId));
    
    return data;
  }))
  res.status(200).json({allFood});
}
// async function handleGetAll(req, res) {

//   let allRecords = await req.model.get();
//   let fav = [];
//   await Promise.all(allRecords.map(async (ele) => {
//       let favData = [];
//       let totalPrice = 0;
//       const favItems = await dataModules.favItems.getItemsByFavId(ele.id);
//       favItems.forEach(Item => {
//           favData.push({
//               foodId: Item.dataValues.foodId,
//               qty: Item.dataValues.qty,
//               price: Item.dataValues.price
              
//           })
//           totalPrice += Item.dataValues.qty * Item.dataValues.price
//       });
//       fav.push({
//           id: ele.id,
//           userId: ele.userId,
//           status: ele.status,
//           totalPrice,
//           favData
//       })
//   }))

//   res.status(200).json(fav)
// }

async function handleGetOne(req, res) {
  const id = req.params.id;
  let allRecords = await req.model.get(id);
  console.log(dataModules.food);
  let allFood= await Promise.all( allRecords.map( ele=>
       dataModules.food.getfav(ele.foodId)

  ))
  res.status(200).json(allFood);
}
// async function handleGetOne(req, res) {
//   const id = req.params.id;
//   let allRecords = await dataModules.favItems.getItemsByFavId(id);
//   res.status(200).json(allRecords);
// }



async function handleCreate(req, res) {
  let obj = req.body;
  let newRecord = await req.model.create(obj);
  let data;
  let foodData; 
  const id = req.params.id;
  let allRecords = await req.model.get(id);
   let allItems= await Promise.all(allRecords.map( async(ele) => {
    foodData = await dataModules.food.getfav(parseInt(ele.foodId));
     
    return foodData;
  }))
  
  res.status(201).json(foodData);
}


// async function handleCreate(req, res) {
//   const { userId, food } = req.body;
//   let fav = await req.model.create({ userId });
//   console.log(dataModules.favItems);
//   let totalPrice = 0;
//   await Promise.all(food.map(async ele => {
//       const obj = {
//           foodId: ele.foodId,
//           qty: ele.qty,
//           price: ele.price,
//           favId: fav.id
//       }
//       await dataModules.favItems.create(obj);
//       totalPrice += ele.price * ele.qty;
//   }));

//   let Items = await dataModules.favItems.getItemsByFavId(fav.id);
//   res.status(201).json({ userId, favId: fav.id, totalPrice, Items: Items });
// }


async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;
  let updatedRecord = await req.model.update(id, obj)
  res.status(200).json(updatedRecord);
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deletedRecord = await req.model.delete(id);
  res.status(200).json(deletedRecord);
}


module.exports = router;