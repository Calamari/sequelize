var Utils = require("../../utils")
  , util  = require("util")

module.exports = (function() {
  var QueryGenerator = {
    createTableQuery: function(tableName, attributes, options) {
      options = options || {}

      var query       = "CREATE TABLE IF NOT EXISTS <%= table %> (<%= attributes%>)"
        , primaryKeys = []
        , attrStr     = Utils._.map(attributes, function(dataType, attr) {
            if (Utils._.includes(dataType, 'PRIMARY KEY')) {
              primaryKeys.push(attr)
              return Utils.addTicks(attr) + " " + dataType
            } else {
              return Utils.addTicks(attr) + " " + dataType
            }
          }).join(", ")
        , values = {
            table: Utils.addTicks(tableName),
            attributes: attrStr,
            charset: (options.charset ? "DEFAULT CHARSET=" + options.charset : "")
          }

      return Utils._.template(query)(values).trim() + ";"
    },

    showTablesQuery: function() {
      return "SELECT name FROM sqlite_master WHERE type='table';"
    },

    attributesToSQL: function(attributes) {
      var result = {}

      Utils._.map(attributes, function(dataType, name) {
        if(Utils.isHash(dataType)) {
          var template     = "<%= type %>"
            , replacements = { type: dataType.type }

          if(dataType.hasOwnProperty('allowNull') && !dataType.allowNull && !dataType.primaryKey)
            template += " NOT NULL"

          if(dataType.defaultValue != undefined) {
            template += " DEFAULT <%= defaultValue %>"
            replacements.defaultValue = Utils.escape(dataType.defaultValue)
          }

          if(dataType.unique) template += " UNIQUE"
          if(dataType.primaryKey) template += " PRIMARY KEY"

          result[name] = Utils._.template(template)(replacements)
        } else {
          result[name] = dataType
        }
      })

      return result
    }
  }

  var MySqlQueryGenerator = Utils._.extend(
    Utils._.clone(require("../query-generator")),
    Utils._.clone(require("../mysql/query-generator"))
  )

  return Utils._.extend(MySqlQueryGenerator, QueryGenerator)
})()
