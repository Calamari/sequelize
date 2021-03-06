var config    = require("../config/config")
  , Sequelize = require("../../index")
  , sequelize = new Sequelize(config.database, config.username, config.password, { logging: false })
  , Helpers   = new (require("../config/helpers"))(sequelize)

describe('ModelFactory', function() {
  beforeEach(function() { Helpers.sync() })
  afterEach(function() { Helpers.drop() })

  var User = sequelize.define('User', { age: Sequelize.INTEGER, name: Sequelize.STRING, bio: Sequelize.TEXT })

  describe('constructor', function() {
    it("handles extended attributes (unique)", function() {
      var User = sequelize.define('User' + config.rand(), {
        username: { type: Sequelize.STRING, unique: true }
      }, { timestamps: false })
      expect(User.attributes).toEqual({username:"VARCHAR(255) UNIQUE",id:"INT NOT NULL auto_increment PRIMARY KEY"})
    })

    it("handles extended attributes (default)", function() {
      var User = sequelize.define('User' + config.rand(), {
        username: {type: Sequelize.STRING, defaultValue: 'foo'}
      }, { timestamps: false })
      expect(User.attributes).toEqual({username:"VARCHAR(255) DEFAULT 'foo'",id:"INT NOT NULL auto_increment PRIMARY KEY"})
    })

    it("handles extended attributes (null)", function() {
      var User = sequelize.define('User' + config.rand(), {
        username: {type: Sequelize.STRING, allowNull: false}
      }, { timestamps: false })
      expect(User.attributes).toEqual({username:"VARCHAR(255) NOT NULL",id:"INT NOT NULL auto_increment PRIMARY KEY"})
    })

    it("handles extended attributes (primaryKey)", function() {
      var User = sequelize.define('User' + config.rand(), {
        username: {type: Sequelize.STRING, primaryKey: true}
      }, { timestamps: false })
      expect(User.attributes).toEqual({username:"VARCHAR(255) PRIMARY KEY"})
    })

    it("adds timestamps", function() {
      var User1 = sequelize.define('User' + config.rand(), {})
      var User2 = sequelize.define('User' + config.rand(), {}, { timestamps: true })

      expect(User1.attributes).toEqual({id:"INT NOT NULL auto_increment PRIMARY KEY", updatedAt:"DATETIME NOT NULL", createdAt:"DATETIME NOT NULL"})
      expect(User2.attributes).toEqual({id:"INT NOT NULL auto_increment PRIMARY KEY", updatedAt:"DATETIME NOT NULL", createdAt:"DATETIME NOT NULL"})
    })

    it("adds deletedAt if paranoid", function() {
      var User = sequelize.define('User' + config.rand(), {}, { paranoid: true })
      expect(User.attributes).toEqual({id:"INT NOT NULL auto_increment PRIMARY KEY", deletedAt:"DATETIME", updatedAt:"DATETIME NOT NULL", createdAt:"DATETIME NOT NULL"})
    })

    it("underscores timestamps if underscored", function() {
      var User = sequelize.define('User' + config.rand(), {}, { paranoid: true, underscored: true })
      expect(User.attributes).toEqual({id:"INT NOT NULL auto_increment PRIMARY KEY", deleted_at:"DATETIME", updated_at:"DATETIME NOT NULL", created_at:"DATETIME NOT NULL"})
    })
  })

  describe('primaryKeys', function() {
    it("determines the correct primaryKeys", function() {
      var User = sequelize.define('User' + config.rand(), {
        foo: {type: Sequelize.STRING, primaryKey: true},
        bar: Sequelize.STRING
      })
      expect(User.primaryKeys).toEqual({"foo":"VARCHAR(255) PRIMARY KEY"})
    })
  })
})
