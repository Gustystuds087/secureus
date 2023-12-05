const Warranty = require('../models/warranty');
const { dateToISOLikeButLocal } = require('../utils/date');
const moment = require('moment');

module.exports.index = async (req, res) => {
  const userId = req.user._doc._id;
  const warrantys = await Warranty.find({
    owner: userId,
  });
  res.render('warrantys/index', {
    warrantys,
  });
};

module.exports.addCard = async (req, res) => {
  const warranty = new Warranty({
    ...req.body.warranty,
    owner: req.user._doc._id,
  });
  warranty.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  const date = moment(warranty.purchase);
  const eDate = date.add(warranty.period, 'month').toDate();
  const expDate = dateToISOLikeButLocal(eDate);
  warranty.expiry = expDate;

  await warranty.save();
  req.flash('success', 'Successfully made a warranty card');
  res.redirect('/warrantys');
};

module.exports.showCard = async (req, res) => {
  const warranty = await Warranty.findById(req.params.id);

  if (!warranty || !warranty.owner.equals(req.user._doc._id)) {
    req.flash('error', 'Cannot find the warranty card');
    return res.redirect('/warrantys');
  }
  res.render('warrantys/show', {
    warranty,
  });
};

module.exports.openUpdateFile = async (req, res) => {
  const warranty = await Warranty.findById(req.params.id);
  if (!warranty.owner.equals(req.user._doc._id)) {
    req.flash('error', 'Cannot find the warranty card');
    return res.redirect('/warrantys');
  }

  res.render('warrantys/edit', {
    warranty,
  });
};

module.exports.updateCard = async (req, res) => {
  const { id } = req.params;
  const war = new Warranty({
    ...req.body.warranty,
    owner: req.user._doc._id,
  });
  const date = moment(war.purchase);
  const eDate = date.add(war.period, 'month').toDate();
  const expDate = dateToISOLikeButLocal(eDate);

  const warranty = await Warranty.findByIdAndUpdate(id, {
    ...req.body.warranty,
    expiry: expDate,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  warranty.images.push(...imgs);
  if (!warranty.owner.equals(req.user._doc._id)) {
    req.flash('error', 'Cannot find the warranty card');
    return res.redirect('/warrantys');
  }
  await warranty.save();
  req.flash('success', 'Successfully updated');
  res.redirect('/warrantys');
  // }
};

module.exports.deleteCard = async (req, res) => {
  const { id } = req.params;
  const warranty = await Warranty.findById(req.params.id);
  if (!warranty.owner.equals(req.user._doc._id)) {
    req.flash('error', 'Cannot find the warranty card');
    return res.redirect('/warrantys');
  }

  await Warranty.findByIdAndDelete(id);
  res.redirect('/warrantys');
};
