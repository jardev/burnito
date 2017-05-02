import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import utils from './application-utils'
import Cookies from 'js-cookies'

import './build/styles/index.css'
import './build/styles/footer.css'
import './build/styles/header.css'
import './build/styles/main.css'
import './build/styles/connect.css'

// 0/808f4f5602feb0f03e0ef861b3d8b326

class Connect extends Component {
  constructor() {
    super(...arguments)
    this.state = { workspaces: [], loading: false, selected: [], projects: [] }

    this.loadApp = this.loadApp.bind(this)
    console.info('token in cookies', Cookies.getItem('scrum_token'))
  }

  loadApp() {
    const that = this
    this.setState({ loading: true })

    utils.asanaRequest('workspaces?opt_fields=id,name,is_organization&limit=100', function(res) {
      console.info('got workspaces with', res.data)
      that.setState({ workspaces: res.data, loading: false })
    })
  }

  render() {
    if (!this.state || this.state.loading) {
      return <aside className='connect'><br /><br />loading ...</aside>
    }
    const { workspaces, projects, selected } = this.state

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
            <input type='text' placeholder='0/3de7b0cbdc27b5a2841f23d1cf8a45c9' defaultValue={Cookies.getItem('scrum_token') || ''} onChange={(e) => { Cookies.setItem('scrum_token', e.target.value) }} />&nbsp;&nbsp;
            <input type='submit' value='Load' onClick={this.loadApp} /><br /><br />
          </div>

          <Workspaces workspaces={workspaces} callback={(projects) => { this.setState({ projects }) }} />
          <Projects projects={projects} callback={(selected) => { console.info(selected.selected); Cookies.setItem('scrum_selectedproject', selected.selected); this.setState({ selected }) }} />
          <Dates project={this.state} disabled={selected.length < 1} callback={(w, date) => { this.setState({ [w]: date })  }} />

          <div className={(!!this.state.from && !!this.state.to) ? '' : 'disabled'}>
            <a className='save button'  href='/#/graph'>Save and load graph</a>
          </div>
        </aside>
      </div>
    )
  }
}

class Workspaces extends Component {
  constructor() {
    super(...arguments)
    this.loadWorkspace = this.loadWorkspace.bind(this)
  }

  loadWorkspace(workspace) {
    const that = this
    console.info('fetching projects for', workspace)

    utils.asanaRequest('projects?opt_fields=workspace,name,id&limit=100&workspace=' + workspace + '&archived=false', function(res) {
      console.info('got projects of workspace', res.data)
      that.props.callback(res.data)
    })
  }

  render() {
    const { workspaces } = this.props

    return (
      <div className={`workspaces ${workspaces.length<1 ? 'disabled' : ''}`}>
        <h2>2. Select a workspace </h2>
        <p>Choose the workspace your want to display projects from.</p>
        <select onChange={(e) => { this.loadWorkspace(e.target.value) }}>
          <option readOnly={true}>-</option>
          {workspaces.map(x => (<option key={x.id} value={x.id}>{x.name}</option>))}
        </select><br /><br />
      </div>
    )
  }
}

class Projects extends Component {
  render() {
    const { projects } = this.props

    return (
      <div className={`${projects.length<1 ? 'disabled' : ''}`}>
        <h2>3. Select a project</h2>
        <p>Select the project you want to display the chart for (only active projects).</p>
        <select onChange={(e) => { this.props.callback({ selected: e.target.value }) }}>
          <option readOnly={true}>-</option>
          {projects.map(x => (<option key={x.id} value={x.id}>{x.name}</option>))}
        </select><br /><br />
      </div>
    )
  }
}

class Dates extends Component {
  render() {
    return (
      <div className={this.props.disabled ? 'disabled' : ''}>
        <h2>4. Enter Start and End date of the sprint </h2>
        <p>(In safari plese enter in format 2017-03-01.</p>
        <input type='date' defaultValue={Cookies.getItem('scrum_from')} onChange={(e) => {
          console.info('cookie saved from date', e.target.value)
          Cookies.setItem('scrum_from', e.target.value)
          this.props.callback('from', e.target.value )}
        } />
        <input type='date' defaultValue={Cookies.getItem('scrum_to')} onChange={(e) => {
          console.info('cookie saved to date', e.target.value)
          Cookies.setItem('scrum_to', e.target.value)
          this.props.callback('to', e.target.value )}
        } /><br /><br /><br />
      </div>
    )
  }
}

class Graph extends Component {
  render() {
    console.info(Cookies.getItem('scrum_selectedproject'))
    return (
      <header className='graph'><div className='wrapper'>
        here i need to add a graph of id<br />
        {Cookies.getItem('scrum_selectedproject')}<br />
        {Cookies.getItem('scrum_from')}<br />
        {Cookies.getItem('scrum_to')}<br />
      </div></header>
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
  <main><Header />{children}</main>
)

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path='/' component={envelope} >
      <IndexRoute component={Main} />
      <Route path='/graph' component={Graph} />
    </Route>
    <Route path='/connect' component={Connect} />
  </Router>,
  document.getElementById('root')
)
