// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');

const { Cat, Dog } = models;

const defaultData = {
  name: 'unknown',
  bedsOwned: 0,
};
let lastAdded = new Cat(defaultData);

// Function to handle rendering the index page.
const hostIndex = (req, res) => {
  res.render('index', {
    currentName: lastAdded.name,
    title: 'Home',
    pageName: 'Home Page',
  });
};
const hostPage1 = async (req, res) => {
  try {
    const docs = await Cat.find({}).lean().exec();

    return res.render('page1', { cats: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'failed to find cats' });
  }
};

const hostPage2 = (req, res) => {
  res.render('page2');
};

const hostPage3 = (req, res) => {
  res.render('page3');
};
const hostPage4 = (req, res) => {
  res.render('page4');
};

const getName = (req, res) => res.json({ name: lastAdded.name });

const setName = async (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
    return res.status(400).json({ error: 'firstname, lastname and beds are all required' });
  }

  const catData = {
    name: `${req.body.firstname} ${req.body.lastname}`,
    bedsOwned: req.body.beds,
  };

  const newCat = new Cat(catData);

  try {
    await newCat.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'failed to create cat' });
  }

  lastAdded = newCat;
  return res.json({
    name: lastAdded.name,
    beds: lastAdded.bedsOwned,
  });
};

const searchName = async (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  let doc;
  try {
    doc = await Cat.findOne({ name: req.query.name }).exec();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }

  if (!doc) {
    return res.json({ error: 'No cats found' });
  }

  return res.json({ name: doc.name, beds: doc.bedsOwned });
};

const searchDogName = async (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  let doc;
  try {
    doc = await Dog.findOne({ name: req.query.name }).exec();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }

  if (!doc) {
    return res.json({ error: 'No dogs found' });
  }

  doc.age++;

  return res.json({ name: doc.name, breed: doc.breed, age: doc.age });
};

const updateLast = (req, res) => {
  lastAdded.bedsOwned++;

  const savePromise = lastAdded.save();

  savePromise.then(() => res.json({
    name: lastAdded.name,
    beds: lastAdded.bedsOwned,
  }));

  savePromise.catch((err) => {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  });
};

const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

const setDogName = async (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.breed || !req.body.age) {
    return res.status(400).json({ error: 'firstname, lastname, breed and age is required' });
  }

  const dogData = {
    name: `${req.body.firstname} ${req.body.lastname}`,
    breed: `${req.body.breed}`,
    age: req.body.age,
  };

  const newDog = new Dog(dogData);

  try {
    await newDog.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'failed to create dog' });
  }
  lastAdded = newDog;
  console.log(newDog);
  return res.json({
    name: lastAdded.name,
    breed: lastAdded.breed,
    age: lastAdded.age,
  });
};

module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  page4: hostPage4,
  getName,
  setName,
  setDogName,
  updateLast,
  searchName,
  searchDogName,
  notFound,
};
