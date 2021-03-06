var helpers = {
  moreSection: function (itemIndex, sectionName, itemsVisible) {
    if (itemIndex >= itemsVisible) { 
      return `${sectionName}-more more-section` 
    }
  },
  moreButton: function (items, sectionName, itemsVisible) {
    if (items.length > itemsVisible) {
      return `<div id="${sectionName}" class="row more-button"><button class="ui button large primary">See More</button></div>`
    }
  },
  pagePartial: function (id) {
    return `subevents/${id}`
  },
  formPartial: function (id) {
    return `subevents/forms/${id}`
  },
}

module.exports = helpers;