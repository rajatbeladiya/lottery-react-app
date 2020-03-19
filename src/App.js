import React, { Component } from "react";
import lottery from "./lottery";

import "./App.css";
import web3 from "./web3";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      manager: '',
      players: [],
      balance: '',
      value: '',
      message: '',
    };
  }

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
  }

  onSubmit = async event => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether'),
    });
    this.setState({ message: 'You have been entered!' });
  }

  onPickWinnerClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success....' })
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    this.setState({ message: 'A winner has been picked' })
  }
   
  render() {
    return (
      <div className="lottery-contract">
        <div className="contract-info">
          <h2 className="title">Lottery Contract</h2>
          <p className="contract-details">
            This contract managed by {this.state.manager}. There are currently{" "}
            {this.state.players.length} people entered, competing to win{" "}
            {web3.utils.fromWei(this.state.balance, 'ether')} ether!
          </p>
        </div>
        <hr />
        <form onSubmit={this.onSubmit} className="lottery-form">
          <h4 className="title">Want to try your luck?</h4>
          <div className="amount-info">
            <label>Amount of ether to enter</label>
            <br />
            <div className="amount-input">
              <input
                value={this.state.value}
                onChange={event => this.setState({ value: event.target.value })}
                required
              />
              <button type="submit" className="enter-button">Enter</button>
            </div>
          </div>
        </form>
        <hr />
        <div className="pick-winner">
          <h4 className="title">Ready to pick a winner?</h4>
          <button onClick={this.onPickWinnerClick} className="pick-winner-button">Pick a winner!</button>
        </div>
        <hr />
        <h1 className="loading">{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
