import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { Provider } from 'react-redux'
import { configureStore } from './store'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/lib/integration/react'

const store = configureStore()
const persistor = persistStore(store)

const Main = () => (
  <Provider store={store}>
    <PersistGate loading={<div>Loading data ...</div>} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
)

ReactDOM.render(<Main />, document.getElementById('root'))
registerServiceWorker()
