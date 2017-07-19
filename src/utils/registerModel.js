module.exports = (app, model) => {
  if (!(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
    console.log(model)
    app.model(model)
  }
}
