class ContactController {
  contact(req, res) {
    return res.render('./frontend/contact')
  }
}

module.exports = new ContactController;