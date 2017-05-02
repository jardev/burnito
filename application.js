import React, { Component } from 'react'
import { render } from 'react-dom'
import ReactDOM from 'react-dom'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import './build/styles/index.css'
import './build/styles/footer.css'
import './build/styles/header.css'
import './build/styles/main.css'

class Connect extends Component {
  render() {
    return (
      <aside id='contact'>
        <h2 className='title email'>
          <a href='mailto:hi@aliename.com?subject=Hello'>HI@<i>ALIENAME</i>.COM</a>
        </h2>
      </aside>
    )
  }
}

class Footer extends Component {
  render() {
    return (
      <footer className='footer'><div className='wrapper'>
        &copy; Burnito 2017
        <a target='_blank' href='https://github.com/ondrek/burnito'>Github</a>
      </div></footer>
    )
  }
}

class Header extends Component {
  render() {
    return (
      <header className='header'><div className='wrapper'>
        <h1><a href='./'>Burnito</a></h1>
      </div></header>
    )
  }
}

class Main extends Component {
  constructor() {
    super(...arguments)
    this.state = { domains: [], texts: {}, refs: [] }

    const url = '//raw.githubusercontent.com/ondrek/aliename/master/.admin.json?' + (+new Date())
    $.getJSON(url, function (adminJson) {
      this.setState({ domains: adminJson.domains, texts: adminJson.texts, refs: adminJson.refs
      })
    }.bind(this))
  }

  render() {
    return (
      <div className='main'>
        <h2>Start by connecting your Asana project</h2>
        <a className='button' href='/#/connect'>Connect my project</a>
      </div>
    )
  }
}

const envelope = ({ children }) => (
  <main><Header />{children}<Footer /></main>
)

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path='/' component={envelope} >
      <IndexRoute component={Main} />
      <Route path='/connect' component={Connect} />
    </Route>
  </Router>,
  document.getElementById('root')
)
