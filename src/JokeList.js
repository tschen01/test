import React, { Component } from "react";
import axios from "axios";
import "./JokeList.css";
import uuid from "uuid/v4";
import Joke from "./Joke";

export default class JokeList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      numberOfJokes: 10,
      jokes: [],
      loading: false,
      value: '',
      joke: 'default'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.seenJokes = new Set(this.state.jokes.map(j => j.text));

    this.handleClick = this.handleClick.bind(this);
    this.refreshClick = this.refreshClick.bind(this);
  
  
  }

  setSingleJoke(state) {
    //alert(state);
    this.state.joke = state;
  }

  componentDidMount() {
    if (this.state.jokes.length === 0) {
      this.getJokes();
    }
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    //alert('Are you sure you want to add ' + this.state.value + " JOKES?");
    event.preventDefault();
  }

  async getJokes2(){
    try{
      // this.state.jokes = [];
      let jokes = [];
      let res = await axios.get("https://icanhazdadjoke.com/", {
          headers: { Accept: "application/json" }
        })
        // ("setSingleJoke", res);
       // this.setSingleJoke(res.data.joke);
       // alert(res.data.joke);
       this.state.jokes.splice(0,1);
       let newJoke = res.data.joke;
       jokes.push({ id: uuid(), text: newJoke, votes: 0 });
       
      //  while (this.state.jokes > this.state.numberOfJokes) {
      //   //Loads joke API
      //   jokes.splice(0,1);
      // }
        this.setState(
          st => ({
            jokes: [...st.jokes, ...jokes],
            loading: false
          }),
          () =>
            window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
        );
      } catch (e) {
        alert(e);
        this.setState({ loading: false });
      }
    }
  
  async getJokes() {
    try {
      this.state.jokes = [];
      let jokes = [];
      this.state.numOfJokes = this.state.value; 
      while (jokes.length < this.state.numOfJokes) {
        //Loads joke API
        let res = await axios.get("https://icanhazdadjoke.com/", {
          headers: { Accept: "application/json" }
        });

        let newJoke = res.data.joke;
        if (!this.seenJokes.has(newJoke)) {
          jokes.push({ id: uuid(), text: newJoke, votes: 0 });
        } else {
          console.log("Found a duplicate!");
          console.log(newJoke);
        }
      }
      this.setState(
        st => ({
          jokes: [...st.jokes, ...jokes],
          loading: false
        }),
        () =>
          window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
      );
    } catch (e) {
      alert(e);
      this.setState({ loading: false });
    }

  }

  handleVote(id, delta) {
    this.setState(
      st => ({
        jokes: st.jokes.map(j =>
          j.id === id ? { ...j, votes: j.votes + delta } : j
        )
      }),
      () =>
        window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
    );
  }

  handleClick() {
    this.setState({ loading: true }, this.getJokes);
  }
  refreshClick(){
    this.setState({ loading: true }, this.getJokes2);
  }

  render() {
    let jokes = this.state.jokes.sort((a, b) => b.votes - a.votes);
    return (
      <div className="JokeList">
        <div className="JokeList-sidebar">
          <h1 className="JokeList-title">
              Jokes
          </h1>
          
          {/* { <img src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg" /> } */}
          <form onSubmit={this.handleSubmit}>
        <label class = "move">
          Number Of Jokes to Display:
          <input type="number" value={this.state.value} onChange={this.handleChange} />
        </label>
        {/* <input type="submit" value="Submit" /> */}
        <button className="JokeList-btn" onClick={this.handleClick}>
            Display Jokes!
          </button>
      </form>

        </div>

        {this.state.loading ? (
          <div >
            <div className="JokeList-spinner">
              <i className="far fa-8x fa-laugh fa-spin" />
              <h1>Loading...</h1>
            </div>
          </div>
        ) : (
          <div >
            {jokes.map(joke => (
              <div>
                <Joke
                  key={joke.id}
                  id={joke.id}
                  text={joke.text}
                  votes={joke.votes}
                  upvote={() => this.handleVote(joke.id, 1)}
                  downvote={() => this.handleVote(joke.id, -1)}

          
                />
                <button className="JokeList-btn2" onClick={this.refreshClick}>
                  Generate Joke
                </button>
              </div>
            ))}
            
          </div>
        )}
      </div>
      
    );

  }
}
