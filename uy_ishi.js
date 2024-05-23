const mongoose = require('mongoose');

const telefonSchema = new mongoose.Schema({
  telefon_id: { type: Number, required: true, unique: true },
  model: String,
  narxi: Number,
  ishlab_chiqaruvchi: String,
  xotira: Number
});

const mijozSchema = new mongoose.Schema({
  mijoz_id: { type: Number, required: true, unique: true },
  ism: String,
  familiya: String,
  telefon: { type: String, required: true, unique: true }
});

const sotuvSchema = new mongoose.Schema({
  sotuv_id: { type: Number, required: true, unique: true },
  telefon_id: { type: Number, ref: 'Telefon' },
  mijoz_id: { type: Number, ref: 'Mijoz' },
  xodim_id: { type: Number, ref: 'Xodim' },
  sotuv_sanasi: { type: Date, default: Date.now },
  miqdori: Number,
  umumiy_narx: Number
});

const xodimSchema = new mongoose.Schema({
  xodim_id: { type: Number, required: true, unique: true },
  ism: String,
  familiya: String,
  lavozimi: String
});

const Telefon = mongoose.model('Telefon', telefonSchema);
const Mijoz = mongoose.model('Mijoz', mijozSchema);
const Sotuv = mongoose.model('Sotuv', sotuvSchema);
const Xodim = mongoose.model('Xodim', xodimSchema);

mongoose.connect("mongodb://localhost:27017/telefon_do'koni", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.error('Error connecting to the database: ', err));

Telefon.aggregate([
  { $group: { _id: '$ishlab_chiqaruvchi', averagePrice: { $avg: '$narxi' } } }
]).then(result => {
  console.log(result);
}).catch(err => {
  console.error(err);
});

Sotuv.aggregate([
  { $group: { _id: '$mijoz_id', totalPurchases: { $sum: 1 } } }
]).then(result => {
  console.log(result);
}).catch(err => {
  console.error(err);
});

Sotuv.aggregate([
  { $group: { _id: '$xodim_id', totalSales: { $sum: 1 } } },
  { $sort: { totalSales: -1 } },
  { $limit: 1 }
]).then(result => {
  console.log(result);
}).catch(err => {
  console.error(err);
});

Telefon.aggregate([
  { $sort: { narxi: 1 } },
  { $skip: 4 },
  { $limit: 5 }
]).then(result => {
  console.log(result);
}).catch(err => {
  console.error(err);
});

Telefon.aggregate([
  { $group: { _id: '$ishlab_chiqaruvchi', averagePrice: { $avg: '$narxi' } } },
  { $sort: { averagePrice: 1 } },
  { $group: { _id: null, cheapest: { $first: '$_id' }, mostExpensive: { $last: '$_id' } } }
]).then(result => {
  console.log(result);
}).catch(err => {
  console.error(err);
});

Telefon.aggregate([
  { $group: { _id: '$ishlab_chiqaruvchi', totalMemory: { $sum: '$xotira' } } },
  { $sort: { totalMemory: -1 } },
  { $limit: 1 }
]).then(result => {
  console.log(result);
}).catch(err => {
  console.error(err);
});

Sotuv.aggregate([
  { $group: { _id: '$telefon_id', averagePrice: { $avg: '$umumiy_narx' }, totalSales: { $sum: 1 } } },
  { $sort: { totalSales: -1 } },
  { $limit: 5 }
]).then(result => {
  console.log(result);
}).catch(err => {
  console.error(err);
});
