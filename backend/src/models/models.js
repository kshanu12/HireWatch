const { DataTypes } = require("sequelize");
const sequelize = require("sequelize");
const db = require("../../config/database");

const User = db.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    role_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false, // Disable timestamps
  }
);

const Role = db.define(
  "roles",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false, // Disable timestamps
  }
);

const Test = db.define(
  "tests",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    duration: {
      type: DataTypes.INTEGER,
    },
    score: {
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.STRING,
    },
    creator_id: {
      type: DataTypes.INTEGER,
    },
    tech_stack_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false, // Disable timestamps
  }
);

const TechStack = db.define(
  "tech_stacks",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false, // Disable timestamps
  }
);

const Question = db.define(
  "questions",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING,
    },
    test_id: {
      type: DataTypes.INTEGER,
    },
    marks: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false, // Disable timestamps
  }
);

const Option = db.define(
  "options",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING,
    },
    is_answer: {
      type: DataTypes.BOOLEAN,
    },
    question_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false, // Disable timestamps
  }
);

const ApplicationStatus = db.define(
  "application_status",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false, // Disable timestamps
  }
);

const ApplicationAction = db.define(
  "application_action",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false, // Disable timestamps
  }
);

const Application = db.define(
  "applications",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    test_id: {
      type: DataTypes.INTEGER,
    },
    application_status_id: {
      type: DataTypes.INTEGER,
    },

    application_action_id: {
      type: DataTypes.INTEGER,
    },
    started_at: {
      type: DataTypes.DATE,
    },
    ended_at: {
      type: DataTypes.DATE,
    },
    score: {
      type: DataTypes.INTEGER,
    },
    broadcast_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false, // Disable timestamps
  }
);

const Violation = db.define(
  "violations",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
    },
    application_id: {
      type: DataTypes.INTEGER,
    },
    image: {
      type: DataTypes.BLOB,
    },
  },
  {
    timestamps: false, // Disable timestamps
  }
);

User.belongsTo(Role, { foreignKey: "role_id" });
Role.hasMany(User, { foreignKey: "role_id" });

Test.belongsTo(User, { foreignKey: "creator_id" });
User.hasMany(Test, { foreignKey: "creator_id" });

Test.belongsTo(TechStack, { foreignKey: "tech_stack_id" });
TechStack.hasMany(Test, { foreignKey: "tech_stack_id" });

Test.hasMany(Question, { foreignKey: "test_id" });
Question.belongsTo(Test, { foreignKey: "test_id" });

Question.hasMany(Option, { foreignKey: "question_id" });
Option.belongsTo(Question, { foreignKey: "question_id" });

Application.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Application, { foreignKey: "user_id" });

Application.belongsTo(Test, { foreignKey: "test_id" });
Test.hasMany(Application, { foreignKey: "test_id" });

Application.belongsTo(ApplicationStatus, {
  foreignKey: "application_status_id",
});
ApplicationStatus.hasMany(Application, { foreignKey: "application_status_id" });

Application.belongsTo(ApplicationAction, {
  foreignKey: "application_action_id",
});
ApplicationAction.hasMany(Application, { foreignKey: "application_action_id" });

Application.hasMany(Violation, { foreignKey: "application_id" });
Violation.belongsTo(Application, { foreignKey: "application_id" });

module.exports = {
  User,
  Role,
  Test,
  TechStack,
  Question,
  Option,
  ApplicationStatus,
  Application,
  Violation,
};
