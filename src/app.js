// const Web3 = require("../../node_modules/web3/index.js");
// c:/Users/ADMIN/Desktop/ToDoList/node_modules/web3/index

App = {
  loading: false,
  contracts: {},
  load: async () => {
    console.log("App Loading ....");
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
  },

  loadWeb3: async () => {
    if (typeof web3 !== "undefined") {
      App.web3Provider = window.ethereum;
      web3 = new Web3(window.ethereum);
    } else {
      window.alert("Please connect to Metamask.");
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        web3.eth.sendTransaction({
          /* ... */
        });
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.ethereum;
      window.web3 = new Web3(window.ethereum);
      // Acccounts always exposed
      web3.eth.sendTransaction({
        /* ... */
      });
    }
    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  },

  loadAccount: async () => {
    App.account = web3.eth.accounts[0];
    console.log(App.account);
  },

  loadContract: async () => {
    const todoList = await $.getJSON("TodoList.json");
    App.contracts.TodoList = TruffleContract(todoList);
    App.contracts.TodoList.setProvider(App.web3Provider);

    // App.todoList = await App.contracts.TodoList.deployed();

    console.log(todoList);
  },

  render: async () => {
    if (App.loading) {
      return;
    }
    App.setLoading(true);

    $("#account").html(App.account);

    await App.renderTasks();

    App.setLoading(false);
  },

  renderTasks: async () => {
    //load
    const taskCount = await App.todoList.taskCount();
    const $taskTemplate = $(".taskTemplate");

    //render
    for (var i = 1; i <= taskCount; i++) {
      const task = await App.todoList.tasks(i);
      const taskId = task[0].toNumber();
      const taskContent = task[1];
      const taskCompleted = task[2];
    }
    const $newTaskTemplate = $taskTemplate.clone();
    $newTaskTemplate.find(".content").html(taskContent);
    $newTaskTemplate
      .find("input")
      .prop("name", taskId)
      .prop("checked", taskCompleted);
    //   .on("click", App.toggleCompleted);
    if (taskCompleted) {
      $("#completedTaskList").append($newTaskTemplate);
    } else {
      $("#taskList").append($newTaskTemplate);
    }
    //show
    $newTaskTemplate.show();
  },

  setLoading: (boolean) => {
    App.loading = boolean;
    const loader = $("#loader");
    const content = $("#content");
    if (boolean) {
      loader.show();
      content.hide();
    } else {
      loader.hide();
      content.show();
    }
  },
};

$(() => {
  $(window).load(() => {
    App.load();
  });
});
