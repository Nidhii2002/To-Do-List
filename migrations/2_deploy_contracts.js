const TodoList = artifacts.require("./truffleTodoList.sol");

module.exports = function (deployer) {
  deployer.deploy(TodoList);
};
