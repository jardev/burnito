import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'

import './build/styles/index.css'
import './build/styles/footer.css'
import './build/styles/header.css'
import './build/styles/main.css'
import './build/styles/connect.css'

class Connect extends Component {
  render() {
    return (
      <div>
        <div className='return'>
          <a href='/'>« Return</a>
        </div>

        <aside className='connect'>
          <h1>Setup</h1>

          <div>
            <h2>1. Connect your Asana account</h2>
            <p>Create a token in Asana and paste it here. You can get this token in Asana by going to My Profile Settings > Apps > Manage > Personal Access Tokens.</p>

            <input className="token" type="text" placeholder="0/3de7b0cbdc27b5a2841f23d1cf8a45c9" />
            &nbsp;&nbsp;
            <input className="token-submit" type="submit" value="Save token" />
            <br /><br />
          </div>

          <div className='disabled'>
            <h2>2. Select a workspace </h2>
            <p>Choose the workspace your want to display projects from.</p>

            <select>&nbsp;</select>
            <br /><br />
          </div>

          <div className='disabled'>
            <h2>3. Select a project</h2>
            <p>Select the project you want to display the chart for (only active projects).</p>

            <select>&nbsp;</select>
            <br /><br />
          </div>

          <div className='disabled'>
            <h2>4. Enter Start and End date of the sprint </h2>
            <p>(In safari plese enter in format 2017-03-01.</p>

            <input type="date" className="startdate" />
            <input type="date" className="enddate" />
            <br /><br /><br />
          </div>

          <input className="save" type="submit" value="Save and load graph" />

        </aside>
      </div>
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
    </Route>
    <Route path='/connect' component={Connect} />
  </Router>,
  document.getElementById('root')
)
