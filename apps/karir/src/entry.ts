import { Layer } from 'effect'
import { Runtime } from 'foldkit'
import * as Home from './app/main.ts'
import * as Showcase from './app/showcase.ts'
import { isShowcaseRoute } from './app/main.ts'
import { ApiRpc } from './platform/rpc.ts'
import { reportCrash, reportSlow, startSentry, tracerLayer } from './platform/sentry.ts'
import './styles.css'

// First, so errors while the app boots are caught too.
startSentry()

const resources = Layer.mergeAll(ApiRpc.layer, tracerLayer)
const container = document.getElementById('root')

if (isShowcaseRoute()) {
  Runtime.run(
    Runtime.makeApplication({
      Model: Showcase.Model,
      init: Showcase.init,
      update: Showcase.update,
      view: Showcase.view,
      resources,
      container,
      crash: { report: reportCrash },
      slow: { show: 'Always', onSlow: reportSlow },
      devTools: { Message: Showcase.Message },
    }),
  )
} else {
  Runtime.run(
    Runtime.makeApplication({
      Model: Home.Model,
      init: Home.init,
      update: Home.update,
      view: Home.view,
      resources,
      container,
      crash: { report: reportCrash },
      slow: { show: 'Always', onSlow: reportSlow },
      devTools: { Message: Home.Message },
    }),
  )
}
