const express = require("express"); //to use express
const bodyParser = require("body-parser"); //json <-> string
const app = express(); //to use express app
const cors = require("cors");

const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const db = require("./config/database"); //to use database
db.authenticate()
  .then(() => console.log("DataBase Connected..."))
  .catch((err) => console.log("ERROR: " + err));

app.use(express.urlencoded({ extended: true })); //ASK

app.use(express.json({ limit: "50mb", extended: true })); //converts requests into json that comes as string

app.use(bodyParser.json()); //for parsing and getting json objects

app.use(
  cors({ origin: "*", methods: ["GET", "POST", "PATCH", "PUT", "DELETE"] })
);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  socket.on("refresh-change", () => {
    socket.broadcast.emit("render-component");
  });

  socket.on("hr-end-candidate-test", () => {
    socket.broadcast.emit("end-test-now");
  });

  socket.on("test-submitted", () => {
    socket.broadcast.emit("live-stream-ended");
  });
});

const dbRouter = require("./src/routes/db_initRoutes");
app.use("/db_init/", dbRouter);

const codingQuestionsRouter = require("./src/routes/codingQuestionsController");
app.use("/coding/", codingQuestionsRouter);

const codingResponsesRouter = require("./src/routes/codingResponsesRoutes");
app.use("/coding_report/", codingResponsesRouter);

const compilerRouter = require("./src/routes/compilerRoutes");
app.use("/compile/", compilerRouter);

const authRouter = require("./src/routes/authRoutes");
app.use("/auth/", authRouter);

const userRouter = require("./src/routes/userRoutes");
app.use("/user/", userRouter);

const roleRouter = require("./src/routes/roleRoutes");
app.use("/role/", roleRouter);

const application_statusRouter = require("./src/routes/application_statusRoutes");
app.use("/application_status/", application_statusRouter);

const application_actionRouter = require("./src/routes/application_actionRoutes");
app.use("/application_action/", application_actionRouter);

const tech_stackRouter = require("./src/routes/tech_stackRoutes");
app.use("/tech_stack/", tech_stackRouter);

const testRouter = require("./src/routes/testRoutes");
app.use("/test/", testRouter);

const applicationRouter = require("./src/routes/applicationRoutes");
app.use("/application/", applicationRouter);

const violationRouter = require("./src/routes/violationRoutes");
app.use("/violation/", violationRouter);

const questionRouter = require("./src/routes/questionRoutes");
app.use("/question/", questionRouter);

const optionRouter = require("./src/routes/optionRoutes");
app.use("/option/", optionRouter);

const reportRouter = require("./src/routes/reportsRoutes");
app.use("/report/", reportRouter);

server.listen(8080, () => {
  console.log("Server is running");
});
